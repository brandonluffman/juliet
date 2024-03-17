import React, { useContext, useEffect, useState } from 'react'
import SidebarSearch from './SidebarSearch';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import { BsBrowserSafari, BsDatabase, BsHddNetwork, BsPlus, BsThreads, BsThreadsFill, BsTwitterX } from "react-icons/bs";
import { AiFillHome, AiOutlineLogin } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { IoMdClose } from 'react-icons/io';
import { supabase } from '../utils/supabaseClient';
import { UserContext } from '../context/UserContext';

const Sidebar = () => {

  const router = useRouter();
  const { user, logout } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [newChatId, setNewChatId] = useState(null);

  const currentPage = router.pathname;

  console.log('Current page:', currentPage);


  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', user.id);
  
        if (error) {
          console.error('Error fetching chats:', error);
        } else {
          setChats(data);
        }
      }
    };
  
    fetchChats();
  }, [user]);

const handleAddChat = () => {
  if (user) {
  supabase
    .from('chats')
    .insert([{ name: 'New Chat', messages: [], user_id: user.id }])
    .single()
    .select('*')
    .then(({ data: newChat, error }) => {
      if (error) {
        console.error('Error adding chat:', error);
      } else {
        setChats((prevChats) => [...prevChats, newChat]);
        router.push(`/chat/${newChat.id}`);
      }
    });
  } else if (!user && currentPage == '/') {
    alert('Please create an account to create & save chats')
  } else {
    router.push('/')

  }
};

  const handleDeleteChat = async (chatId) => {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);
  
    if (error) {
      console.error('Error deleting chat:', error);
    } else {
      // Filter out the deleted chat from the local state
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
  
      // If the current chat is deleted, route to the next available chat
      if (router.query.chatId === chatId.toString()) {
        const nextChat = updatedChats[0]; // Get the first chat in the updated list
        if (nextChat) {
          router.push(`/chat/${nextChat.id}`);
        } else {
          // If there are no more chats, route to a different page or show a message
          router.push('/'); // Example: Route to the home page
        }
      }
    }
  };

  {user ? console.log(user):console.log('No user found')}

    return (
      <div className='sidebar'>
        <h2>Juliet</h2>
        {/* <SidebarSearch /> */}
        <div className='sidebar-inbox-top'>        
          <h4>Inbox</h4>
          <BsPlus onClick={handleAddChat} className='sidebar-add-btn'/>     
        </div>

        <ul className='sidebar-chat-inbox'>
        <li><Link href="/answer">Answer</Link></li>
        {chats && chats.map((chat) => (
          (chat && 
          <li key={chat.id} className={router.query.chatId === chat?.id.toString() ? 'active-chat' : ''}>

            <Link href={`/chat/${chat?.id}`}>
              {chat?.name}
            </Link>
            <button onClick={() => handleDeleteChat(chat?.id)}><IoMdClose /></button> {/* Add a delete button */}
          </li>
          )
        ))}
      </ul>
        <ul className='sidebar-menu'>
          <li><Link href="/"><AiFillHome /> Home</Link></li>
          <li><Link href="/discover"><BsBrowserSafari /> Discover</Link></li>
          <li><Link href="/threads"><BsThreadsFill /> Threads</Link></li>
          {user ? (
            <li onClick={() => logout()}><Link href="/login"><AiOutlineLogin /> Log Out</Link></li>
          ) : (
            <li><Link href="/login"><AiOutlineLogin /> Sign In</Link></li>
          )}
          {!user && <li><Link href="/register"><button>Sign Up</button></Link></li>}
          {user && <li><Link href='/account'><div className='profile-img'><img src='/profile-img.png'></img></div>{user.user_metadata.username}</Link></li>}

        </ul>

        <div>
        </div>
      
        <div className="bottom-sidebar">
            <Link href="/"><button>Download</button></Link>
            <div>
            <Link href="/"><BsTwitterX /></Link>
            <Link href="/"><FaDiscord /></Link>
            </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;