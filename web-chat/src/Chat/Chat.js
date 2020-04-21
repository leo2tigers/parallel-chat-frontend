import React from 'react'
import './Chat.css'

class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }

    render(){
        return (
            <div class="bgcolor">
                <div class="container justify-content-center">
                    <div class="row">
                        <div class="col-md-12" align="center">
                            <div class="box-chat">
                                <div class="row menubgcolor">
                                    <div class="col-md-4 textchatheader" align="left">
                                        Welcome back, Suchut
                                    </div>
                                    <div class="col-md-8 textchatheader">
                                        Group B
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4" style={{paddingTop : "1.0 em"}}>
                                        <div class="row">
                                            <div class="col-md-10">
                                                <input class="inbox-white" style={{width:"100%"}}/>
                                            </div>
                                            <div class="col-md-2">
                                                <div>S</div>
                                            </div>
                                        </div>
                                        <div class="row box-insidechat textchatheader" align="left">
                                            Group A
                                        </div>
                                        <div class="row box-insidechat-active textchatheader" align="left">
                                            Group B
                                        </div>
                                        <div class="row box-insidechat textchatheader" align="left">
                                            Group C
                                        </div>
                                    </div>
                                    <div class="col-md-8 chatspace">
                                        
                                    </div>
                                </div>
                                <div class="row submenu">
                                    <div class="col-md-4" style={{paddingTop:"1.0em"}}>
                                        <div class="col-md-4">
                                            Icon
                                        </div>
                                        <div class="col-md-4">
                                            Icon
                                        </div>
                                        <div class="col-md-4">
                                            Icon
                                        </div>
                                    </div>
                                    <div class="col-md-8 chatinputbox" style={{paddingTop:"1.0em"}}>
                                        <input class="inbox-white" style={{marginBottom: "1.5rem", width: "100%"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Chat