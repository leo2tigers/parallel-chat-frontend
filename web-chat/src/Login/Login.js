import React from "react";
import "./Login.css";
import { signIn , setToken, getUsername,getUserId,getToken} from "../../src/LocalStorageService";
import axios from "axios";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      name: "",
      registerCheck: false,
      isChecking : true,
    };
  }

  handleValidate = () => {
    if (this.state.username === "") {
      alert("please enter username at least 1 character");
      return false;
    }
    if (this.state.password.length < 8) {
      alert("please enter password at least 8 characters");
      return false;
    }
    if (this.state.registerCheck) {
      if (this.state.name === "") {
        alert("please enter username at least 1 character");
        return false;
      }
    }
    return true;
  };
  handleSignIn = async () => {
    if (!this.handleValidate()) {
      return;
    }
    if (!this.state.registerCheck) {
      /// sign in
      try{
        let res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/auth/login",{
            username : this.state.username,
            password : this.state.password
        });
        console.log(res.data)
        signIn(res.data.id,res.data.username,"")
        setToken(res.data.access_token)
        window.location.href = "/chat";
      }catch(err){
        if(err && err.response && err.response.status===401){
            alert("wrong username or password")
        }
        console.log(err.response)
      }
    } else {
      /// sign up
      try {
        let res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/user", {
          username: this.state.username,
          password: this.state.password,
          name: this.state.name
        });
        if(res){
            alert("successful")
        }
      }catch(err){
        if(err && err.response && err.response.status===400){
            alert("Username has been used")
        }
          console.log(err)
      }
    }

    //signIn(1, this.state.username, "0");
  };

  handleWrite = e => {
    if (e.target.name === "username") {
      this.setState({ username: e.target.value });
    } else if (e.target.name === "password") {
      this.setState({ password: e.target.value });
    } else if (e.target.name === "name") {
      this.setState({ name: e.target.value });
    }
  };
  handleMode = e => {
    this.setState({ registerCheck: e.target.checked });
  };
  onEnter = e => {
    if (e.keyCode === 13) {
      this.handleSignIn();
    }
  };

  componentDidMount=async()=>{
    if(getUsername()&&getUserId()&&getToken()){
        window.location.href="/chat"
    }else{
        await this.setState({isChecking : false})
    }
  }

  render() {
    if(this.state.isChecking){
        return null;
    }
    return (
      <div className="bgcolor">
        <div className="container justify-content-center">
          <div className="row">
            <div className="col-md-12" align="center">
              <div className="box-login">
                <div className="row">
                  <div className="col-md-12 textheader">Paraloid</div>
                </div>
                <div className="row">
                  <label>username</label>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <input
                      className="inbox"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleWrite}
                      onKeyDown={this.onEnter}
                    />
                  </div>
                </div>
                <div className="row">
                  <label>password</label>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <input
                      className="inbox"
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleWrite}
                      onKeyDown={this.onEnter}
                    />
                  </div>
                </div>
                <div className="row" hidden={!this.state.registerCheck}>
                  <label>name</label>
                </div>
                <div className="row" hidden={!this.state.registerCheck}>
                  <div className="col-md-12">
                    <input
                      className="inbox"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleWrite}
                      onKeyDown={this.onEnter}
                    />
                  </div>
                </div>
                <div className="row">
                  <button
                    id="signIn"
                    className="button"
                    onClick={this.handleSignIn}
                  >
                    {this.state.registerCheck ? "register" : "Login"}
                  </button>
                </div>
                <input
                  type="checkBox"
                  value={this.state.registerCheck}
                  onChange={this.handleMode}
                  aria-label="Radio button for following text input"
                />{" "}
                register
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
