var token = localStorage.getItem("token");
var user_id = localStorage.getItem("user_id");
var username = localStorage.getItem("username");

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

    render() {
        var classNames = "button oneusebutton " + this.props.progress + " "
        if(this.props.classNames != undefined) 
        {
            classNames += this.props.classNames;
        }
        if(this.props.progress == "disabled")
        {
            return <div className={classNames} disabled type="button"> 
                {this.props.text}
            </div>;
        }
        if(this.props.progress == "not-clicked")
        {
            return <div className={classNames} type="button" onClick={this.props.handleClick}> 
                {this.props.text}
            </div>;
        }
        else if(this.props.progress == "working")
        {
            return <div className={classNames} disabled type="button">
                <i className="fas fa-spinner fa-pulse"></i> 
                {this.props.text}
            </div>;
        }
        else if(this.props.progress == "error")
        {
            return <div className={classNames} type="button" onClick={this.props.handleClick}>
                <i className="fas fa-exclamation-circle"></i> 
                {this.props.text}
            </div>;
        }
        else if(this.props.progress == "done")
        {
            return <div className={classNames} disabled type="button">
                <i className="fas fa-check"></i> 
                {this.props.text}
            </div>;
        }
    }
}

class ToggleButton extends React.Component {

    render() {
        var classNames = "button togglebutton " + this.props.className;
        if(this.props.buttonState)
        {
            classNames += " on";
        }
        else
        {
            classNames += " off";
        }
        return <div className={classNames} onClick={this.props.handleClick} type="button"> 
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
            <OneUseButton handleClick={this.onLoginClick} progress={progress} text="Login"></OneUseButton>
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
        fetch("http://127.0.0.1:5000/api/v1/user/token", {
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
            <OneUseButton handleClick={this.onRegisterClick} progress={progress} text="Register"></OneUseButton>
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
        fetch("http://127.0.0.1:5000/api/v1/user/register", {
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
        fetch("http://127.0.0.1:5000/api/v1/user/token", {
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
            editable: false
        }
    }

    render()
    {
        var editButton = null;
        if(this.props.userId === user_id);
        {
            editButton = <ToggleButton handleClick={this.toggleEditable} className="editbutton" buttonState={this.state.editable} text="Edit"></ToggleButton>;
        }
        return <div className="profile">
            <h2>{this.props.username}'s profile {editButton}</h2>
            <GamesList editable={this.state.editable} userId={this.props.userId}></GamesList>
        </div>
    }

    toggleEditable = () => {
        this.setState(prevState => ({
            editable: !prevState.editable
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
        //GET the list of owned games
        fetch("http://127.0.0.1:5000/api/v1/copy/list?user_id=" + this.props.userId, {
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
        window.location.href = "http://127.0.0.1:5000/openid/steam/login?token=" + token + "&redirect_to=https://steffo99.github.io/game-log-client/"s;
    }

    render() {
        var games;
        if(this.state.progress == "loading")
        {
            games = <div className="gameslist loading">
                <i className="fas fa-spinner fa-pulse"></i> Loading games...
            </div>
        }
        else if(this.state.progress == "error")
        {
            games = <div className="gameslist error">
                <i className="fas fa-exclamation-circle"></i> An error occoured while loading games.
            </div>
        }
        else if(this.state.progress == "done")
        {
            games = this.state.copies.map((gamecopy) => {
                return <GameCopy gameCopy={gamecopy} editable={this.props.editable} key={gamecopy.id}></GameCopy>
            });
            
        }
        var steamAddContents = <div><i className="fab fa-steam"></i> Add games from Steam</div>;
        return <div className="gameslist done">
            {games}
            <OneUseButton handleClick={this.onAddSteamGamesClick} progress={this.state.steamLoginProgress} text={steamAddContents} classNames="addgamebutton"></OneUseButton>
        </div>;
    }
}

class GameCopy extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.gameCopy;
    }

    render() {
        var classNames = "gamecopy ";
        if(this.state.rating === null || this.state.rating === "UNRATED")
        {
            classNames += "unrated";
        }
        else
        {
            classNames += this.state.rating.toLowerCase();
        }
        return <div className={classNames}>
            <RatingWidget editable={this.props.editable} rating={this.state.rating} clickHandler={this.handleRatings}></RatingWidget>
            <div className="gamename">{this.state.game.name}<span className="gameplatform">{this.state.game.platform}</span></div>
            <ProgressWidget editable={this.props.editable} progress={this.state.progress} clickHandler={this.handleProgress}></ProgressWidget>
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
        fetch("http://127.0.0.1:5000/api/v1/copy/rating", {
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
        fetch("http://127.0.0.1:5000/api/v1/copy/progress", {
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
        return <div className="progresswidget">
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.progress} value="NOT_STARTED" iconName="fa-eraser"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.progress} value="UNFINISHED" iconName="fa-play"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.progress} value="BEATEN" iconName="fa-check-circle"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.progress} value="COMPLETED" iconName="fa-trophy"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.progress} value="MASTERED" iconName="fa-gem"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.progress} value="NO_PROGRESS" iconName="fa-ban"></ClickableIcon>
        </div>
    }
}

class RatingWidget extends React.Component {
    render() {
        return <div className="ratingwidget">
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.rating} value="UNRATED" iconName="fa-eraser"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.rating} value="DISLIKED" iconName="fa-thumbs-down"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.rating} value="MIXED" iconName="fa-circle"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.rating} value="LIKED" iconName="fa-thumbs-up"></ClickableIcon>
            <ClickableIcon editable={this.props.editable} clickHandler={this.props.clickHandler} selection={this.props.rating} value="LOVED" iconName="fa-heart"></ClickableIcon>
        </div>
    }
}

class ClickableIcon extends React.Component {
    handleClick = () => {
        if(this.props.editable)
        {
            this.props.clickHandler(this.props.value);
        }
    }

    render() {
        var classNames = "clickableicon fas " + this.props.iconName + " " + this.props.value.toLowerCase();
        if(this.props.editable)
        {
            classNames += " editable"
        }
        if(this.props.selection == this.props.value)
        {
            classNames += " selected"
        }
        return <i className={classNames} onClick={this.handleClick}></i>
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