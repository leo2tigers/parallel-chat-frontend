import React from 'react'
import './Login.css'
class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    
    render(){
        return(
            <div class="bgcolor">
                <div class="container justify-content-center">
                    <div class="row">
                        <div class="col-md-12" align="center">
                            <div class="box-login">
                                <div class="row">
                                    <div class="col-md-12 textheader">
                                        Paraloid
                                    </div>
                                </div>
                                <div class="row">
                                    username
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <input class="inbox"/>
                                    </div>
                                </div>
                                <div class="row">
                                    password
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <input class="inbox"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <button class="button">Login</button>
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