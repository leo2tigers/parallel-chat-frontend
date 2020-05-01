import React from "react";
import "./Chat.css";
import profileimage from "./profileimg.jpg";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import AddIcon from "@material-ui/icons/Add";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import axios from "axios";
import socketIOClient from "socket.io-client";
import {
  signOut,
  setCurrentGroup,
  getCurrentGroup,
  getUsername,
  getUserId,
  getToken
} from "../../src/LocalStorageService";
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      user_name: "",
      group_name: "",
      group_list: [],
      group_select_id: "",
      messages: [],
      loadData: false,
      error: { disconenct: "" },
      filter: "",
      sendingMessage : "",
      members : new Map(),
      socket : null,
    };
    this.chat = React.createRef();
    this.num = 0
  }
  respose = () => {
    this.state.socket.emit('login',{
      user : this.state.user_id
    });
    this.state.socket.on('new-message',async(res) => {
      console.log(res)
      if(res.group!==this.state.group_select_id) return;
      let arr = [...this.state.messages]
      arr.push(res)
      await this.setState({messages : arr})
      await this.scrollToBottom()
      //await this.setState({ messages: res });
    });
    this.state.socket.on('connect', res => {
      console.log("connect")
      //await this.setState({ messages: res });
    });
    this.state.socket.on('disconnect', res => {
      console.log("disconnect")
      this.state.socket.connect()
      //await this.setState({ messages: res });
    });
    this.state.socket.on("change-focused-room-reply", res =>{
      console.log(res)
    })
    this.state.socket.on('user-join',async res=>{
      console.log(res)
      this.fetchData()
      this.fetchGroupMessage()
      /*
      let arr = [...this.state.group_list]
      arr.push(res)
      await this.setState({group_list : arr})
      await this.state.members.set(res.user,res.userDisplayname)
      if(res.group!==this.state.group_select_id) return;
      let msg = [...this.state.messages]
      arr.push(res.userDisplayname+" joined the group")
      await this.setState({messages : msg})
      */
    });
    this.state.socket.on('user-leave',async res=>{
      console.log(res)
      this.fetchData()
      /*let arr = this.state.group_list
      let arr2 = arr.filter((item)=>res.group!== item)
      console.log(arr2)
      await this.setState({group_list : arr2})
      await this.state.members.set(res.user,res.userDisplayname)*/
    });
    this.state.socket.on('new-group',async res=>{
      console.log(res)
    })
  };
  handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  fetchData = async () => {
    /// mock data
    await this.setState({
      group_select_id: getCurrentGroup(),
      user_id: getUserId()
    });
    try {
      let res2 = await axios.get(process.env.REACT_APP_BACKEND_URL +"/user/"+this.state.user_id)
      await this.setState({user_name : res2.data.name})
      let res1 = await axios.get(
        process.env.REACT_APP_BACKEND_URL +
          "/group/group-list/" +
          this.state.user_id
      );
      let selected_group = res1.data
      .filter(item =>
        item._id===getCurrentGroup()
      )
      if(selected_group.length >0){
        this.setState({ group_name : selected_group[0].groupName })
      }
      for(let i=0;i<res1.data.length;i++){
        let group = res1.data[i].members
        console.log(res1.data[i])
        for(let j=0;j<group.length;j++){
          console.log(group[j])
          console.log(this.state.members.get(group[j]))
          if(this.state.members.has(group[j])) continue
          try{
            let member = await axios.get(process.env.REACT_APP_BACKEND_URL + "/user/"+group[j])
            this.state.members.set(group[j],member.data.name)
            //console.log(member)
          }catch(err){
            console.log(err.response)
          }
          
        }
      }
      //console.log(this.state.members)
     
      await this.setState({ group_list: res1.data});
      console.log(res1.data);
    } catch (err) {
      console.log(err);
    }
    
    console.log(getCurrentGroup());
    /*
    let msg = [
      {
        msg_id: "1",
        text: "hello world ",
        user_name: "suchut",
        user_id: "1",
        timestamp: "time"
      },
      {
        msg_id: "2",
        text: "สวัสดี เราชื่อ อิท",
        user_name: this.state.user_name,
        user_id: 2,
        timestamp: "time"
      }
    ];*/
    this.setState({ loadData: true });
  };

  fetchGroupMessage=async()=>{
      try{
        let res2 = await axios.get(process.env.REACT_APP_BACKEND_URL + "/message/group/"+this.state.group_select_id)
        this.setState({messages : res2.data})
      }catch(err){
        console.log(err.response)
      }
  }

  componentDidMount = async()=>{
    if (!getUsername()) {
      window.location.href = "/";
    }
    if(this.state.socket === null){
      await this.setState({socket : socketIOClient(process.env.REACT_APP_BACKEND_SOCKET,{transports : ['websocket']})})
    }
    await this.fetchData();
    await this.respose();
    await this.scrollToBottom()
    if(this.state.group_select_id !== ""){
      await this.fetchGroupMessage()
    }
    
  }
  componentDidUpdate = async(prevProp,prevState)=>{
    if(prevState.group_select_id !== this.state.group_select_id){
      await this.fetchGroupMessage()
      await this.scrollToBottom()
      
    }
  }
  handleSelect = async (id, name) => {
    await this.setState({
      group_name: name,
      group_select_id: id
    });
    setCurrentGroup(id);
    if(this.state.group_select_id === "") return;
    this.state.socket.emit("change-focused-room", {
      group: this.state.group_select_id
    });
    
  };

  handleSearch = e => {
    this.setState({ filter: e.target.value });
  };

  handleCreateGroup = async () => {
    let groupname = prompt("Please enter group name");
    if (groupname === null) {
      return;
    }
    if (groupname.length < 1) {
      alert("your group name must has at least 1 character");
      return;
    }
    try {
      /*axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
      let res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/group", {
        creator: this.state.user_id,
        groupName: groupname
      });*/
      await this.state.socket.emit('create-group',{
        groupName : groupname,
        user : this.state.user_id,
      })
      this.fetchData();
    } catch (err) {
      if (err && err.response) console.log(err.response);
    }
  };
  handleLeaveGroup = async () => {
    if(this.state.group_select_id === ""){
      alert("please select group to leave")
      return;
    }
    let confirm = window.confirm("Do you want to leave from "+this.state.group_name+"?")
    if(confirm){
      try{
        /*axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
        let res = await axios.patch(process.env.REACT_APP_BACKEND_URL+"/user/group",{
          groupId : this.state.group_select_id
        })*/
        await this.state.socket.emit('leave-group',{
          group : this.state.group_select_id,
          user : this.state.user_id,
        })
        //await this.fetchData()
        await this.handleSelect("","")
        await this.setState({messages : []})
        
      }catch(err){
        alert("error")
        console.log(err.response)
      }
    }
  };
  handleJoinGroup = async()=>{
    let groupId = prompt("Please enter group ID");
    if (groupId === null) {
      return;
    }
      try{
        /*axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
        let res = await axios.post(process.env.REACT_APP_BACKEND_URL+"/user/group",{
          groupId : groupId
        })*/
        await this.state.socket.emit('join-group',{
          group : groupId,
          user : this.state.user_id,
        })
        //await this.fetchData()
      }catch(err){
        alert("error")
        console.log(err)
      }
    
  }
  handleSendMessage = async()=>{
    /// fake message
    if(this.state.sendingMessage === "") return
    try{
      /*axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
      let res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/message",{
        message : this.state.sendingMessage,
        group : this.state.group_select_id,
        sender : this.state.user_id,
      })*/
      console.log(this.state.sendingMessage,this.state.group_select_id,this.state.user_id)
      this.state.socket.emit('send-message',{
        message : this.state.sendingMessage,
        group : this.state.group_select_id,
        user : this.state.user_id,
      })
      this.setState({sendingMessage : ""})
      //await this.fetchGroupMessage()
    }catch(err){
      console.log(err.response)
    }
  }
  scrollToBottom = () => {
    //this.state.ref.current.scrollIntoView({ behavior: "smooth" });
    if(this.chat.current === null) return
    this.chat.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    //element.scrollTop = element.scrollHeight;
  }
  handleWriteMessage = (e)=>{
    this.setState({sendingMessage : e.target.value})
  }
  renderlist() {
    if (this.state.group_list.length === 0) {
      return <h5>No group added yet</h5>;
    }
    return this.state.group_list
      .filter(item =>
        item.groupName.toLowerCase().includes(this.state.filter.toLowerCase())
      )
      .map((item, index) => (
        <>
          {this.state.group_select_id === item._id ? (
            <div
              key={index}
              className="box-insidechat-active"
              align="left"
            >
              <p>{item.groupName}</p>
            </div>
          ) : (
            <div
              key={index}
              className="box-insidechat"
              align="left"
              onClick={() => this.handleSelect(item._id, item.groupName)}
            >
              <p>{item.groupName}</p>
            </div>
          )}
          <hr style={{ margin: "1px 2vh", borderTop: "1px solid #BFBFBF" }} />
        </>
      ));
  }
  formatTime=(time)=>{
    let format = new Date(time).toLocaleString();
    return format;
  }
  renderMessage() {
    return this.state.messages.map((item, index) => (
      <div ref={this.chat}>
        {this.state.user_id === item.sender ? (
          <div className="msg-myself" key={index}>
            <img src={profileimage} className="profile-img" alt="me" />
            <div className="wraper">
              <h6>{this.state.members.get(item.sender)}</h6>
              <div className="time">
                <div className="msg-bubble">
                  <p>{item.message}</p>
                </div>
                <p id="timesend">{this.formatTime(item.createdAt)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="msg-other" key={index}>
            <img src={profileimage} className="profile-img" alt="other" />
            <div className="wraper">
              <h6>{this.state.members.get(item.sender)}</h6>
              <div className="time">
                <div className="msg-bubble">
                  <p>{item.message}</p>
                </div>
                <p id="timesend">{this.formatTime(item.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    ));
  }
  renderMenu() {
    return (
      <>
        <div className="col-xs-4">
          <IconButton
            aria-label="create-group"
            style={{ backgroundColor: "var(--box-color)" }}
            onClick={this.handleCreateGroup}
          >
            <AddIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="col-xs-4">
          <IconButton
            aria-label="person-add"
            style={{ backgroundColor: "var(--box-color)" }}
            onClick={this.handleJoinGroup}
          >
            <GroupAddIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="col-xs-4">
          <IconButton
            aria-label="exit-from-group"
            style={{ backgroundColor: "var(--box-color)" }}
            onClick={this.handleLeaveGroup}
          >
            <ExitToAppIcon fontSize="large" />
          </IconButton>
        </div>
      </>
    );
  }

  render() {
    if (!this.state.loadData) {
      return null;
    }
    return (
      <div className="container">
        <div className="box-chat">
          <div className="col-md-4 con">
            <div className="row menubgcolor">
              <div className="textchatheader" align="left">
                Welcome back, {this.state.user_name}
              </div>
            </div>
            <div className="row searchbar">
              <div className="col-md-12">
                <TextField
                  fullWidth
                  placeholder="Search group"
                  onChange={e => this.handleSearch(e)}
                  InputProps={{
                    style: {
                      fontSize: "1.5rem",
                      backgroundColor: "white",
                      marginBottom: "1vh",
                      paddingInlineStart: "5px",
                      paddingInlineEnd: "5px",
                      marginTop: "1vh"
                    }
                  }}
                />
              </div>
            </div>
            <div className="row group-list">{this.renderlist()}</div>
            <div className="row submenu menu-bar">{this.renderMenu()}</div>
          </div>
          <div className="col-md-8">
            <div className="row menubgcolor">
              <div className="col-md-11">
                <div className="textchatheader">{this.state.group_name}</div>
                <div className="textchatheader">id : {this.state.group_select_id}</div>
              </div>
              <div className="col-md-1">
                <p
                  onClick={this.handleSignOut}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Logout
                </p>
              </div>
            </div>
            <div className="row">
              <div className="chatspace">{this.renderMessage()}</div>
            </div>
            <div className="row chatinputbox" style={{ paddingTop: "1.0em" }}>
              <div className="input-bar">
                <textarea
                  value={this.state.sendingMessage}
                  onChange = {this.handleWriteMessage}
                  style={{ resize: "none" }}
                  placeholder="type here"
                  aria-label="Username"
                  className="input-msg-box"
                ></textarea>
                <div className="input-button">
                  <IconButton aria-label="send" onClick={this.handleSendMessage}>
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Chat;
