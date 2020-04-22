import React from 'react'
import './Chat.css'
import profileimage from'./profileimg.jpg'
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={
            user_id : "",
            user_name : "",
            group_name : "",
            group_list : [],
            group_select_id : "",
            messages:[],
        }
    }

    fetchData=()=>{
        /// mock data
        let list = [{id:"1",name : "group A"},{id:"2",name : "group B"},{id:"3",name : "group C"},
        {id:"4",name : "group D"},{id:"5",name : "group E"},{id:"6",name : "group F"},
        {id:"7",name : "group G"},{id:"8",name : "group H"},{id:"9",name : "group I"},
        {id:"10",name : "group J"},{id:"11",name : "group K"},{id:"12",name : "group L"}
       ]
       let msg = [{id:"1",text:"hello world hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world",user_name:"suchut",user_id:"1"},
       {id:"2",text:"hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello",user_name:"it",user_id:"2"}]
        this.setState({
            user_id : "1",
            user_name : "suchut",
            group_name : "group B",
            group_list : list,
            group_select_id : "2",
            messages : msg,
        })
    }

    componentDidMount(){
        this.fetchData()
    }

    handleSelect=(id,name)=>{
        this.setState({
            group_name : name,
            group_select_id : id,
        })
    }
    renderlist(){
        return this.state.group_list.map((item,index)=>(
            <>
            {this.state.group_select_id === item.id?
            <div key={index} className="box-insidechat-active textchatheader" align="left">
                <p>{item.name}</p>
            </div>
            :
            <div key={index} className="box-insidechat textchatheader" align="left" onClick={()=>this.handleSelect(item.id,item.name)} >
                <p>{item.name}</p>
            </div>
            }
            </>
        ))
    }
    renderMessage(){
        return this.state.messages.map((item,index)=>(
            <>
            {this.state.user_id === item.user_id?
            <div className="msg-myself">
                <img src={profileimage}className="profile-img"/>
                <div className="wraper">
                <p>{item.user_name}</p>
                    <div className="time">
                    <div className="msg-bubble">
                        <p>{item.text}</p>
                    </div>
                    <p>{"time"}</p>
                    </div>
                </div>
               
            </div>
            :
            <div className="msg-other">
                <img src={profileimage} className="profile-img"/>
                <div className="wraper">
                <p>{item.user_name}</p>
                    <div className="time">
                    <div className="msg-bubble">
                        <p>{item.text}</p>
                    </div>
                    <p>{"time"}</p>
                    </div>
                </div>
            </div>
            }  
            </>
        ))
    }
    renderMenu(){
        return (
            <>
            <div className="col-xs-4">
                Icon
            </div>
            <div className="col-xs-4">
                Icon
            </div>
            <div className="col-xs-4">
                Icon
            </div>
            </>
        )
    }
    render(){
        return (
                <div className="container">
                        <div className="box-chat">
                            <div className="col-md-4 con">
                                <div className="row menubgcolor" align="left">
                                    <div className="textchatheader" align="left">
                                        Welcome back, {this.state.user_name}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-10">
                                        <input className="inbox-white" style={{width:"100%"}}/>
                                    </div>
                                    <div className="col-md-2">
                                        <div>S</div>
                                    </div>
                                </div>
                                <div className="row group-list">
                                    {this.renderlist()}
                                </div>
                                <div className="row submenu menu-bar" >
                                    {this.renderMenu()}
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="row menubgcolor">
                                    <div className="textchatheader">
                                        {this.state.group_name}
                                    </div>
                                </div>
                                <div className="row">
                                <div className="chatspace">
                                    {this.renderMessage()}
                                </div>
                                </div>
                                <div className="row submenu">
                                    <div className="chatinputbox" style={{paddingTop:"1.0em"}}>
                                        <input className="inbox-white" style={{marginBottom: "1.5rem", width: "90%"}} align="right"/>
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                           
                            
        )
    }
}
export default Chat