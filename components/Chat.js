import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {BsArrowUp} from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'

const Chat = () => {
  return (
    <>
        <Navbar />
    <div className='chat-container'>
    <div className='chat-inbox-container'>
      <div className='new-chat-button-div'>
      <button className='new-chat-button' type='button'>Create New Chat <AiOutlinePlus className='plus-icon' /></button>
      </div>
      <h2 className='chat-inbox-header'>Chat</h2>
      <div className='chat-inbox'>
        <div className='chat-inbox-card'>
        <div className='chat-inbox-card-time'>
          <p>3:33pm</p>
          </div>
            <div className='chat-inbox-card-title'>
            <h2 className='chat-inbox-card-title-header'>What to expect from wisdom tooth surgery?</h2>
          </div>
      </div>
      <div className='chat-inbox-card'>
      <div className='chat-inbox-card-time'>
          <p>3:33pm</p>
          </div>
          <div className='chat-inbox-card-title'>
          <h2 className='chat-inbox-card-title-header'>What to expect from wisdom tooth surgery?</h2>
          </div>
      </div>
    </div>
      
    </div>
    <div className='chat-messages-container'>
      <form className='chat-messages-form'>
        <input className='chat-messages-input' placeholder='Type a message here...' type='text'></input>
        <button className='chat-messages-send-button' type='submit'><BsArrowUp /></button>
      </form>
      <p className='chat-messages-message-time'>Today at 3:33pm</p>
      <div className='chat-messages-message-container'>
        <div className='chat-messages-message'>What to expect from wisdom tooth surgery?</div>
        <img className='chat-messages-message-profile' src='/propic.jpeg' width='50'></img>
      </div>
      <p className='chat-message-delivered'>Delivered</p>
      <div className='chat-messages-response-container'>
        <div className='chat-messages-response'>
            This is a delivered message
        </div>
      </div>
    </div>
  </div>
  {/* <Footer /> */}
  </>
  )
}

export default Chat