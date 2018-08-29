class FormElement extends React.Component {
    constructor(props)
    {
        super(props);
    }

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
    constructor(props) {
        super(props);
    }

    render() {
        var classNames = "oneusebutton " + this.props.progress
        if(this.props.progress == "disabled")
        {
            return <button className={classNames} disabled type="button"> 
                {this.props.text}
            </button>;
        }
        if(this.props.progress == "not-clicked")
        {
            return <button className={classNames} type="button" onClick={this.props.handleClick}> 
                {this.props.text}
            </button>;
        }
        else if(this.props.progress == "working")
        {
            return <button className={classNames} disabled type="button">
                <i className="fas fa-spinner fa-pulse"></i> 
                {this.props.text}
            </button>;
        }
        else if(this.props.progress == "error")
        {
            return <button className={classNames} type="button" onClick={this.props.handleClick}>
                <i className="fas fa-exclamation-circle"></i> 
                {this.props.text}
            </button>;
        }
        else if(this.props.progress == "done")
        {
            return <button className={classNames} disabled type="button">
                <i className="fas fa-check"></i> 
                {this.props.text}
            </button>;
        }
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
                localStorage.setItem("logged_user_unsafe", result.user)
                localStorage.setItem("login_token", result.token)
                window.location.href = "main.html"
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
                localStorage.setItem("logged_user_unsafe", result.user)
                localStorage.setItem("login_token", result.token)
                window.location.href = "main.html"
            }
        },
        (error) => {
            this.setState({
                progress: "error"
            });
        })
    }
}
/*
var token = localStorage.getItem("login_token");
var user = localStorage.getItem("logged_user_unsafe");
*/

var token = null;
var user = null;

if(token !== null && user !== null)
{
    window.location.href = "main.html"
}
else
{
    ReactDOM.render(
        <div id="login">
            <LoginForm></LoginForm>
            <RegisterForm></RegisterForm>
        </div>,
        document.getElementById('react')
    );
}
