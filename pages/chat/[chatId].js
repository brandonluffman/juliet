import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Search from '../../components/Search';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import { UserContext } from '../../context/UserContext';

const ChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const [chats, setChats] = useState([]);
  const { user, logout } = useContext(UserContext);

  return (
    <div>
    <Sidebar />
      <Search />
    </div>
  );
};

export default ChatPage;



  // const fetchChats = async () => {
  //   const response = await fetch('/api/chats');
  //   const data = await response.json();
  //   console.log('chats', data)
  //   setChats(data);
  // };

  // useEffect(() => {
  //   fetchChats();
  // }, []);

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
  //   await fetch('/api/chats', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   fetchChats(); // Fetch the updated list of chats
  // };