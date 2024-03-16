import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import ThreadPage from '../components/ThreadPage';

const Threads = () => {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
      const response = await fetch('/api/chats');
      const data = await response.json();
      console.log('chats', data)
      setChats(data);
    };
  
    useEffect(() => {
      fetchChats();
    }, []);
  
    const handleAddChat = async () => {
      await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchChats(); // Fetch the updated list of chats
    };
  return (
    <div>
      <Sidebar chats={chats} onAddClick={handleAddChat} setChats={setChats} />
    <ThreadPage />
    </div>
  )
}

export default Threads