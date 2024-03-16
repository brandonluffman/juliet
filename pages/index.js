import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Chat from '../components/Chat'
import Search from '../components/Search'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { UserContext } from '../context/UserContext';

export default function Home() {
  const [chats, setChats] = useState([]);
  const { user, logout } = useContext(UserContext);


  // useEffect(() => {
  //   const fetchChats = async () => {
  //     if (user) {
  //       const { data, error } = await supabase
  //         .from('chats')
  //         .select('*')
  //         .eq('user_id', user.id);
  
  //       if (error) {
  //         console.error('Error fetching chats:', error);
  //       } else {
  //         setChats(data);
  //       }
  //     }
  //   };
  
  //   fetchChats();
  // }, [user]);



  // const handleAddChat = async () => {
  //   const { data: newChat, error } = await supabase
  //     .from('chats')
  //     .insert([{ name: 'New Chat', messages: [], user_id: user.id }])
  //     .single();
  
  //   if (error) {
  //     console.error('Error adding chat:', error);
  //   } else {
  //     setChats((prevChats) => [...prevChats, newChat]);
  //   }
  // };

  return (
    <>
      <div className='index-container'>
      <Sidebar />
        <Search setChats={setChats} />
      </div>
    </>
  )
}
