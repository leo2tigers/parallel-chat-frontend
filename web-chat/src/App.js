import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Login from './Login/Login'
import Chat from './Chat/Chat'
class App extends React.Component {
  render(){
    return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
  );}
}

export default App;
