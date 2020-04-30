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
      endpoint: "",
      loadData: false,
      error: { disconenct: "" },
      filter: ""
    };
  }
  respose = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("join room", {
      user_id: this.state.user_id,
      group_id: this.state.group_select_id
    });
    socket.on("load message", async res => {
      await this.setState({ messages: res });
    });
    socket.on("connect", async res => {
      await this.setState({ messages: [] });
    });
    socket.on("disconnenct", async res => {
      await this.setState({ ...this.state.error, disconenct: res });
    });
  };
  handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  fetchData = async () => {
    /// mock data
    await this.setState({
      group_select_id: getCurrentGroup(),
      user_name: getUsername(),
      user_id: getUserId()
    });
    try {
      let res = await axios.get(
        process.env.REACT_APP_BACKEND_URL +
          "/group/group-list/" +
          this.state.user_id
      );
      let selected_group = res.data
      .filter(item =>
        item._id===getCurrentGroup()
      )
      if(selected_group.length >0){
        this.setState({ group_name : selected_group[0].groupName })
      }
      this.setState({ group_list: res.data,});
      console.log(res.data);
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

  componentDidMount() {
    if (!getUsername()) {
      window.location.href = "/";
    }
    this.fetchData();
  }

  handleSelect = async (id, name) => {
    //const socket = socketIOClient(this.state.endpoint);
    await this.setState({
      group_name: name,
      group_select_id: id
    });
    setCurrentGroup(id);
    /*socket.emit("join room", {
      user_id: this.state.user_id,
      group_id: this.state.group_select_id
    });*/
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
      let res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/group", {
        creator: this.state.user_id,
        groupName: groupname
      });
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
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
        let res = await axios.delete(process.env.REACT_APP_BACKEND_URL+"/user/group",{
          groupId : this.state.group_select_id
        })
        this.fetchData()
      }catch(err){
        alert("error")
        console.log(err.respone)
      }
    }
  };
  handleJoinGroup = async(e)=>{
    let groupId = prompt("Please enter group ID");
    if (groupId === null) {
      return;
    }
      try{
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
        let res = await axios.post(process.env.REACT_APP_BACKEND_URL+"/user/group",{
          groupId : groupId
        })
        this.fetchData()
      }catch(err){
        alert("error")
        console.log(err)
      }
    
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
              className="box-insidechat-active textchatheader"
              align="left"
            >
              <p>{item.groupName}</p>
            </div>
          ) : (
            <div
              key={index}
              className="box-insidechat textchatheader"
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

  renderMessage() {
    return this.state.messages.map((item, index) => (
      <>
        {this.state.user_id === item.user_id ? (
          <div className="msg-myself" key={index}>
            <img src={profileimage} className="profile-img" alt="me" />
            <div className="wraper">
              <h6>{item.user_name}</h6>
              <div className="time">
                <div className="msg-bubble">
                  <p>{item.text}</p>
                </div>
                <p id="timesend">{"time"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="msg-other" key={index}>
            <img src={profileimage} className="profile-img" alt="other" />
            <div className="wraper">
              <h6>{item.user_name}</h6>
              <div className="time">
                <div className="msg-bubble">
                  <p>{item.text}</p>
                </div>
                <p id="timesend">{"time"}</p>
              </div>
            </div>
          </div>
        )}
      </>
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
              <div className="col-md-11 textchatheader">
                {this.state.group_name}
                <br/>id : {this.state.group_select_id}
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
                  style={{ resize: "none" }}
                  placeholder="type here"
                  aria-label="Username"
                  className="input-msg-box"
                ></textarea>
                <div className="input-button">
                  <IconButton aria-label="send">
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
