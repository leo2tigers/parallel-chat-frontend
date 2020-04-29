import React from 'react'
import './Login.css'
import {signIn, signOut} from "../../src/LocalStorageService"
import axios from "axios"
class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:"",
            password:"",
        }
    }
    
    handleSignIn=()=>{
        if(this.state.username===""){
            return alert("please put username")
        }
        if(this.state.password===""){
            return alert("please put password")
        }
        signIn(1,this.state.username,"0")
        window.location.href="/chat"
    }

    handleWrite=(e)=>{
        if(e.target.name === "username"){
            this.setState({username : e.target.value})
        }else if(e.target.name === "password"){
            this.setState({password : e.target.value})
        }
    }
    onEnter=(e)=>{
        if(e.keyCode === 13){
            this.handleSignIn()
        }
    }

    componentDidMount(){
        signOut()
    }

    render(){
        return(
            <div className="bgcolor">
                <div className="container justify-content-center">
                    <div className="row">
                        <div className="col-md-12" align="center">
                            <div className="box-login">
                                <div className="row">
                                    <div className="col-md-12 textheader">
                                        Paraloid
                                    </div>
                                </div>
                                <div className="row">
                                    <label>username</label>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <input className="inbox" name="username" onChange={this.handleWrite} onKeyDown={this.onEnter}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <label>password</label>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <input className="inbox" type="password" name="password" onChange={this.handleWrite} onKeyDown={this.onEnter}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <button id="signIn" className="button" onClick={this.handleSignIn}>Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login