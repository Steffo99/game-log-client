var token = localStorage.getItem("token");
var user_id = localStorage.getItem("user_id");
var username = localStorage.getItem("username");
var host = "https://game-log.steffo.eu";

function noU(variable)
{
    return (variable ? variable : "")
}

class FormElement extends React.Component {
    render() {
        var type;
        var status = "formelement";
        if(this.props.type !== undefined)
        {
            type = this.props.type;
        }
        else
        {
            type = "text";
        }
        if(this.props.error !== undefined)
        {
            status += " error";
        }
        return <label className={status} title={this.props.error}><span>{this.props.name}</span> <input onInput={this.handleInput} type={type} name={this.props.name} /></label>
    }

    handleInput = (event) => {
        this.props.handleInput(event);
    }
}

class OneUseButton extends React.Component {

    nullFunction = () => {};

    render() {
        var className = "button oneusebutton " + this.props.progress + " " + noU(this.props.className);
        var disabled = !(this.props.progress == "not-clicked" || this.props.progress == "error");
        var handleClick = disabled ? this.nullFunction : this.props.handleClick;
        var iconClasses;
        if(this.props.progress == "working") iconClasses = "icon fas fa-spinner fa-pulse";
        else if(this.props.progress == "error") iconClasses = "icon fas fa-exclamation-circle";
        else if(this.props.progress == "success") iconClasses = "icon fas fa-check";
        else
        {
            iconClasses = "icon " + noU(this.props.icon);
        }
        return <div id={noU(this.props.id)} className={className} disabled={disabled} onClick={handleClick}>
            <i className={iconClasses}></i>
            {this.props.text}
        </div>;
    }
}

class ToggleButton extends React.Component {

    render() {
        var classNames = "button togglebutton " + noU(this.props.className) + " " + (this.props.buttonState ? "on" : "off");
        return <div id={noU(this.props.id)} className={classNames} onClick={this.props.handleClick} type="button"> 
            {this.props.text}
        </div>;
    }
}

class LoginForm extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {username: "", password: "", progress: "not-clicked"}
    }

    render() {
        var progress;
        if(this.state.username === "" || this.state.password === "")
        {
            progress = "disabled";
        }
        else {
            progress = this.state.progress;
        }
        return <div className="form login">
            <h1>Login</h1>
            <FormElement handleInput={this.onUserInput} name="username"></FormElement>
            <FormElement handleInput={this.onPasswordInput} name="password" type="password"></FormElement>
            <OneUseButton id="loginbutton" handleClick={this.onLoginClick} progress={progress} text="Login"></OneUseButton>
        </div>;
    }

    onUserInput = (event) => {
        this.setState({username: event.target.value});
    }

    onPasswordInput = (event) => {
        this.setState({password: event.target.value});
    }

    onLoginClick = () => {
        this.setState({
            progress: "working"
        });
        //Get the login data
        var data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        //Send the request
        fetch(host + "/api/v1/user/token", {
            "method": "POST",
            "body": data
        })
        .then(res => res.json())
        .then((result) => {
            if(result.result == "error")
            {
                this.setState({
                    progress: "error"
                });
                return;
            }
            else if(result.result == "success")
            {
                this.setState({
                    progress: "done"
                });
                token = result.token;
                user_id = result.user.id;
                username = result.user.username;
                localStorage.setItem("token", token);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("username", username);
                ReactDOM.render(
                    <MainSite></MainSite>,
                    document.getElementById('react')
                );
            }
        },
        (error) => {
            this.setState({
                progress: "error"
            });
        })
    }
}

class RegisterForm extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            username: "", 
            password: "",
            confirm_password: "",
            progress: "not-clicked"
        }
    }

    render() {
        var progress;
        if(this.state.username === "" || this.state.password === "" || this.state.password !== this.state.confirm_password)
        {
            progress = "disabled";
        }
        else
        {
            progress = this.state.progress;
        }
        return <div className="form register">
            <h1>Register</h1>
            <FormElement handleInput={this.onUserInput} name="username"></FormElement>
            <FormElement handleInput={this.onPasswordInput} name="password" type="password"></FormElement>
            <FormElement handleInput={this.onConfirmPasswordInput} name="confirm-password" type="password"></FormElement>
            <OneUseButton id="registerbutton" handleClick={this.onRegisterClick} progress={progress} text="Register"></OneUseButton>
        </div>
    }

    onUserInput = (event) => {
        this.setState({username: event.target.value});
    }

    onPasswordInput = (event) => {
        this.setState({password: event.target.value});
    }

    onConfirmPasswordInput = (event) => {
        this.setState({confirm_password: event.target.value});
    }

    onRegisterClick = () => {
        //Get the new account data
        var username = this.state.username;
        var password = this.state.password;
        //Create the formdata
        var data = new FormData();
        data.append("username", username);
        data.append("password", password);
        //Send the request
        fetch(host + "/api/v1/user/register", {
            "method": "POST",
            "body": data
        })
        .then(res => res.json())
        .then((result) => {
            if(result.result == "error")
            {
                this.setState({
                    progress: "error"
                });
                return;
            }
            else if(result.result == "success")
            {
                this.setState({
                    progress: "done"
                });
                return;
            }
        },
        (error) => {
            this.setState({
                progress: "error"
            });
        })
        //Now login too
        fetch(host + "/api/v1/user/token", {
            "method": "POST",
            "body": data
        })
        .then(res => res.json())
        .then((result) => {
            if(result.result == "error")
            {
                this.setState({
                    progress: "error"
                });
                return;
            }
            else if(result.result == "success")
            {
                this.setState({
                    progress: "done"
                });
                token = result.token;
                user_id = result.user.id;
                username = result.user.username;
                localStorage.setItem("token", token);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("username", username);
                ReactDOM.render(
                    <MainSite></MainSite>,
                    document.getElementById('react')
                );
            }
        },
        (error) => {
            this.setState({
                progress: "error"
            });
        })
    }
}

class MainSite extends React.Component {
    render()
    {
        return <Profile userId={user_id} username={username}></Profile>
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
    }

    render()
    {
        var editable = (this.props.userId === user_id)
        var editButton = editable ? editButton = <ToggleButton id="editbutton" handleClick={this.toggleEditable} buttonState={this.state.editing} text="Edit"></ToggleButton> : null;
        return <div id="profile">
            <h2>{this.props.username}'s profile {editButton}</h2>
            <GamesList editing={this.state.editing} userId={this.props.userId}></GamesList>
        </div>;
    }

    toggleEditable = () => {
        this.setState(prevState => ({
            editing: !prevState.editing
        }));
    }
}

class GamesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: "loading",
            copies: [],
            steamLoginProgress: "not-clicked"
        }
    }

    componentDidMount() {
        this.getGamesList();
    }

    getGamesList = () => {
        //GET the list of owned games
        fetch(host + "/api/v1/copy/list?user_id=" + this.props.userId, {
            "method": "GET"
        })
        .then(res => res.json())
        .then((result) => {
            if(result.result == "error")
            {
                this.setState({
                    progress: "error"
                });
                return;
            }
            else if(result.result == "success")
            {
                this.setState({
                    progress: "done",
                    copies: result.copies
                });
            }
        },
        (error) => {
            this.setState({
                progress: "error"
            });
        })
    }

    onAddSteamGamesClick = () => {
        this.setState({
            steamLoginProgress: "working"
        });
        window.location.href = host + "/openid/steam/login?token=" + token + "&redirect_to=https://steffo99.github.io/game-log-client/";
    }

    render() {
        var games;
        if(this.state.progress == "loading")
        {
            games = <div className="gameslist loading">
                <div className="game null">
                    <div className="rating">
                        <i className="fas fa-spinner fa-pulse"></i>
                    </div>
                    Loading games...
                </div>
            </div>
        }
        else if(this.state.progress == "error")
        {
            games = <div className="gameslist error">
                <div className="game null">
                    <div className="rating">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    An error occoured while loading games.
                </div>
            </div>
        }
        else if(this.state.progress == "done")
        {
            games = this.state.copies.map((gamecopy) => {
                return <GameCopy gameCopy={gamecopy} editing={this.props.editing} key={gamecopy.id}></GameCopy>
            });
        }
        return <div className="gameslist done">
            {games}
            <OneUseButton id="addsteamgamesbutton" className="game null" text="Sync games from Steam" handleClick={this.onAddSteamGamesClick} progress={this.state.steamLoginProgress} icon="fab fa-steam rating"></OneUseButton>
        </div>;
    }
}

class GameCopy extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.gameCopy;
    }

    render() {
        var classNames = "game ";
        if(this.state.rating === null || this.state.rating === "UNRATED")
        {
            classNames += "unrated";
        }
        else
        {
            classNames += this.state.rating.toLowerCase();
        }
        return <div className={classNames}>
            <RatingWidget editing={this.props.editing} rating={this.state.rating} clickHandler={this.handleRatings}></RatingWidget>
            <div className="name">{this.state.game.name}<span className="platform">{this.state.game.platform}</span></div>
            <ProgressWidget editing={this.props.editing} progress={this.state.progress} clickHandler={this.handleProgress}></ProgressWidget>
        </div>;
    }

    handleRatings = (rating) => {
        var previous_rating = this.state.rating;
        this.setState({
            rating: rating
        });
        var data = new FormData()
        data.append("copy_id", this.state.id);
        data.append("rating", rating);
        data.append("token", token)
        fetch(host + "/api/v1/copy/rating", {
            "method": "POST",
            "body": data
        })
        .then(res => res.json())
        .then((result) => {
            if(result.result == "error")
            {
                this.setState({
                    rating: previous_rating
                });
            }
        }, 
        (error) => {
            this.setState({
                rating: previous_rating
            });
        })
    }

    handleProgress = (progress) => {
        var previous_progress = this.state.progress;
        this.setState({
            progress: progress
        });
        var data = new FormData()
        data.append("copy_id", this.state.id);
        data.append("progress", progress);
        data.append("token", token)
        fetch(host + "/api/v1/copy/progress", {
            "method": "POST",
            "body": data
        })
        .then(res => res.json())
        .then((result) => {
            if(result.result == "error")
            {
                this.setState({
                    progress: previous_progress
                });
            }
        }, 
        (error) => {
            this.setState({
                progress: previous_progress
            });
        })
    }
}

class ProgressWidget extends React.Component {
    render() {
        var not_started = (this.props.editing || this.props.progress === "NOT_STARTED") ? <ClickableIcon title="Not started yet" editing={this.props.editing} currentValue={this.props.progress} clickHandler={this.props.clickHandler} value="NOT_STARTED" iconName="fas fa-stop-circle"></ClickableIcon> : null;
        var unfinished = (this.props.editing || this.props.progress === "UNFINISHED") ? <ClickableIcon title="Unfinished" editing={this.props.editing} currentValue={this.props.progress} clickHandler={this.props.clickHandler} value="UNFINISHED" iconName="fas fa-play-circle"></ClickableIcon> : null;
        var beaten = (this.props.editing || this.props.progress === "BEATEN") ? <ClickableIcon title="Beaten (finished main story)" editing={this.props.editing} currentValue={this.props.progress} clickHandler={this.props.clickHandler} value="BEATEN" iconName="fas fa-check-circle"></ClickableIcon> : null;
        var completed = (this.props.editing || this.props.progress === "COMPLETED") ? <ClickableIcon title="Completed (100%)" editing={this.props.editing} currentValue={this.props.progress} clickHandler={this.props.clickHandler} value="COMPLETED" iconName="fas fa-trophy"></ClickableIcon> : null;
        var mastered = (this.props.editing || this.props.progress === "MASTERED") ? <ClickableIcon title="Mastered (200% / speedrun / etc)" editing={this.props.editing} currentValue={this.props.progress} clickHandler={this.props.clickHandler} value="MASTERED" iconName="fas fa-gem"></ClickableIcon> : null;
        var no_progress = (this.props.editing || this.props.progress === "NO_PROGRESS") ? <ClickableIcon title="No progress (game doesn't have an ending)" editing={this.props.editing} currentValue={this.props.progress} clickHandler={this.props.clickHandler} value="NO_PROGRESS" iconName="fas fa-circle"></ClickableIcon> : null;
        return <div className="progress">
            {no_progress}
            {not_started}
            {unfinished}
            {beaten}
            {completed}
            {mastered}
        </div>
    }
}

class RatingWidget extends React.Component {
    render() {
        var disliked = (this.props.editing || this.props.rating === "DISLIKED") ? <ClickableIcon title="Disliked" currentValue={this.props.rating} editing={this.props.editing} clickHandler={this.props.clickHandler} value="DISLIKED" iconName="fas fa-thumbs-down"></ClickableIcon> : null;
        var mixed = (this.props.editing || this.props.rating === "MIXED") ? <ClickableIcon title="Mixed" currentValue={this.props.rating} editing={this.props.editing} clickHandler={this.props.clickHandler} value="MIXED" iconName="fas fa-circle"></ClickableIcon> : null;
        var liked = (this.props.editing || this.props.rating === "LIKED") ? <ClickableIcon title="Liked" currentValue={this.props.rating} editing={this.props.editing} clickHandler={this.props.clickHandler} value="LIKED" iconName="fas fa-thumbs-up"></ClickableIcon> : null;
        var loved = (this.props.editing || this.props.rating === "LOVED") ? <ClickableIcon title="Loved" currentValue={this.props.rating} editing={this.props.editing} clickHandler={this.props.clickHandler} value="LOVED" iconName="fas fa-heart"></ClickableIcon> : null;
        return <div className="rating">
            {disliked}
            {mixed}
            {liked}
            {loved}
        </div>;
    }
}

class ClickableIcon extends React.Component {
    handleClick = () => {
        if(this.props.editing)
        {
            if(this.props.value === this.props.currentValue)
            {
                this.props.clickHandler(null)
            }
            else
            {
                this.props.clickHandler(this.props.value);
            }
        }
    }

    render() {
        var classNames = "icon clickableicon " + noU(this.props.iconName) + " " + this.props.value.toLowerCase() + (this.props.editing ? " editing" : "") + (this.props.currentValue == this.props.value ? " selected" : "");
        return <i title={noU(this.props.title)} className={classNames} onClick={this.handleClick}></i>;
    }
}

if(token === null)
{
    ReactDOM.render(
        <div id="login">
            <LoginForm></LoginForm>
            <RegisterForm></RegisterForm>
        </div>,
        document.getElementById('react')
    );
}
else
{
    ReactDOM.render(
        <MainSite></MainSite>,
        document.getElementById('react')
    );
}