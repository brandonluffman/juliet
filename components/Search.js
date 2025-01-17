import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { BsArrowRight, BsCopy, BsDot, BsGoogle, BsOpticalAudio, BsQuestion, BsQuestionCircle, BsReddit, BsYoutube } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { UserContext } from '../context/UserContext';
import { AiFillSound, AiOutlineDislike } from 'react-icons/ai';
import { FaRegPlayCircle } from 'react-icons/fa';
import Loading from './Loading';

const Search = ({ setChats }) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandedLoad, setExpandedLoad] = useState(false);
  // const [data, setData] = useState(null);
  const [data, setData] = useState({});

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const textareaRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useContext(UserContext);
  const { chatId } = router.query;


  useEffect(() => {
    if (chatId && user) {
      supabase
        .from('chats')
        .select('messages')
        .eq('id', chatId)
        .single()
        .then(({ data, error }) => {
          if (data) {
            console.log('messages', data.messages)
            setChatHistory(data.messages);
          } else {
            console.log('No Data')
          }
        });
    }
  }, [chatId, user]);


    const handleSubmit = async (e) => {
    console.log('In Handle Submit');
    e.preventDefault();
    if (query.trim()) {
      let currentChatId = chatId;
  
      if (!chatId && user) {
        const { data: newChat, error: newChatError } = await supabase
          .from('chats')
          .insert([{ name: query.split(' ').slice(0, 4).join(' '), messages: [], user_id: user.id }])
          .single()
          .select();
  
        if (newChatError) {
          console.error('Error creating new chat:', newChatError);
          return;
        }
  
        currentChatId = newChat.id;
        setChats((prevChats) => [...prevChats, newChat]);
        setChatHistory(newChat.messages)

        router.push(`/chat/${currentChatId}`);
        setChatHistory(newChat.messages)

      }
  
      // Add the query to the chat history immediately with a placeholder response
      const newMessage = { query, response: 'Thinking...' };
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
  
      handleExpandClick(query, 'google', chatHistory.length);

      // supabase
      // .from('threads')
      // .select('*')
      // .then(({ data, error }) => {
      //   if (data) {
      //     console.log('Threads grabbed for chat', data.messages)
      //     setChatHistory(data.messages);
      //   } else {
      //     console.log('No Data')
      //   }
      // });

      const { data: threads, error: threadsError } = await supabase
      .from('threads')
      .select('*')
      .limit(3);

    if (threadsError) {
      console.error('Error fetching threads:', threadsError);
    } else {
      console.log('Threads grabbed for chat', threads);
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[prevHistory.length - 1].threads = threads;
        return updatedHistory;
      });
    }

      // Determine the API endpoint based on whether chatId is defined
      const apiEndpoint = currentChatId ? `/api/chats/${currentChatId}` : '/api/chats';
  
      // Send the query to your API endpoint
      fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: query })
      })
      .then(response => response.json())
      .then(data => {
        // Update the response for the specific query in the chat history
        setChatHistory((prevHistory) =>
          prevHistory.map((msg) =>
            msg.query === query ? { ...msg, response: data.response } : msg
          )
        );
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  
      setQuery(''); // Clear the input field
    }
  };

  
  const handleInputChange = (e) => {
    const textarea = textareaRef.current;
    setQuery(e.target.value);
    textarea.style.height = 'auto';
    textarea.style.rows = '1';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleAskThePublic = async (query) => {
    if (user)  {
    const { data, error } = await supabase
    .from('threads')
    .insert([
      {
        title: query,
        user_id: user.id,
      },
    ])
    .select('*');

    if (error) {
      console.error('Error creating thread:', error);
      return;
    }
    const newThreadId = data[0].id;
    router.push(`/thread/${newThreadId}`);
  } else {
      alert('You must create an account to ask the public.')
    }
  };


  
  // const handleExpandClick = async (query, source, index) => {
  //   if (expanded && expandedIndex === index && data[index] && data[index].source === source) {
  //     // Collapse the content if the same button is clicked again
  //     setExpanded(false);
  //     setExpandedIndex(null);
  //   } else {
  //     // Show a loading spinner and fetch new results
  //     setIsLoading(true);
  //     setExpanded(true);
  //     setExpandedIndex(index);
  //     const response = await fetch(`/api/search/${source}/${query}`);
  //     const jsonData = await response.json();
  //     setData(prevData => ({
  //       ...prevData,
  //       [index]: { results: jsonData, source } // Store the results keyed by the message index
  //     }));
  //     setIsLoading(false);
  //   }
  // };

  const handleExpandClick = async (query, source, index) => {
    setIsLoading(true);
    setExpandedIndex(index);
    const response = await fetch(`/api/search/${source}/${query}`);
    const jsonData = await response.json();
    setData((prevData) => ({
      ...prevData,
      [index]: { results: jsonData, source },
    }));
    setIsLoading(false);
  };
  const extractUrl = (link) => {
    const urlParams = new URLSearchParams(link.split('?')[1]);
    return urlParams.get('url');
  };

  return (
    <div className={chatHistory.length < 1 ? 'search-container': 'search-container-chat'}>
      <div>
        <div className='chat-top-block'></div>
        <div className={chatHistory.length < 1 ? '' : 'chat-history'}>

            {chatHistory.length > 0 && chatHistory.map((entry, index) => {
              const message = typeof entry === 'string' ? JSON.parse(entry) : entry; // Only parse if entry is a string
              return (
                <div key={index} className='chat-entry'>
                  <div className='query-div'>
                    <p className='chat-messages-message'>{message.query}</p>
                  </div>
                  <div>
                    <p className={`chat-messages-response ${index === chatHistory.length - 1 ? 'typing' : ''}`}>
                      <div className='chat-messages-top-container'>
                      {message.response}
                      <br></br>
                      <br></br>
                      <div className='chat-messages-btns'>
                      <button className='google-btn' onClick={() => handleExpandClick(message.query, 'google', index)}><BsGoogle /></button>
                      <button className='reddit-btn' onClick={() => handleExpandClick(message.query, 'reddit', index)}><BsReddit /></button>
                      <button className='youtube-btn' onClick={() => handleExpandClick(message.query, 'youtube', index)}><BsYoutube /></button>
                      {/* <button className='atp-btn' onClick={() => handleAskThePublic(message.query)}><BsQuestion /></button> */}
                      </div>

                      <div className="message-expanded-container">
                {isLoading && expandedIndex === index ? (
                  <div className="loading-spinner-container">
                    <Loading />
                  </div>
                ) : data[index] && Array.isArray(data[index].results) ? (
                  data[index].results.map((item, idx) => (
                    <div key={idx} className="">
                      <img src={item.faviconSrc} width={30} />
                      <a href={extractUrl(item.link)} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
              
                    {/* {expanded && expandedIndex === index && (
                      <div className='message-expanded-container'>
                        {isLoading && expandedIndex === index ? (
                          <div className='loading-spinner-container'><Loading /></div>
                        ) : (
                          data[index] && Array.isArray(data[index].results) && data[index].results.map((item, idx) => (
                            <div key={idx} className=''>
                              <img src={item.faviconSrc} width={30} />
                              <a href={extractUrl(item.link)} target="_blank" rel="noopener noreferrer">
                                {item.title}
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    )} */}
                    </div>
                            {/* <div>
                              <AiFillSound />
                              <BsCopy />
                            <FaRegPlayCircle />
                            <AiOutlineDislike />
                            </div> */}
                      <div className='chat-message-sentiment'>
                        <h6>Related Threads</h6>
                        <div className='sentiment-threads'>
                            {message.threads && message.threads.map((thread, idx) => (
                              <div key={idx}>
                                <a href={`/thread/${thread.id}`}>{thread.title}</a>
                              </div>
                            ))}
                          </div>
                        <div className=''>
                      <button className='atp-btn' onClick={() => handleAskThePublic(message.query)}>Ask the public <BsQuestion /></button>
                      </div>
                    </div>
                    </p>
                  </div>
        
                </div>
              );
            })}

        </div>
        
      {chatHistory.length < 1 && <h2>Ask Anything</h2>}

      <div className={chatHistory.length < 1 ? 'search-form-initial' : 'search-form'}>
        <form className={chatHistory.length < 1 ? 'searchBar': 'searchBarBottom'} onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className='searchInput'
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent the default action (inserting a new line)
                handleSubmit(e); // Submit the form
              }
            }}
            rows="1"
          />
          <button type="submit" className='searchButton'>
            <BsArrowRight />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Search;


{/* <h6>Trending Searches</h6>
<ul>
  <li>Best old money clothing brands for guys</li>
  <li>Which cafes have wifi in Arlington Clarendon neighborhood?</li>
  <li>What&apos;s happening in Gaza?</li>
</ul> */}

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (query.trim()) {
  //     const response = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
  //     const newMessage = { query, response };
  
  //     let currentChatId = chatId;
  
  //     // If no chatId is provided, create a new chat
  //     if (!chatId) {
  //       const newChatResponse = await fetch('/api/chats', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const newChat = await newChatResponse.json();
  //       currentChatId = newChat.id;
  
  //       // Update the parent component's state with the new chat
  //       setChats((prevChats) => [...prevChats, newChat]);
  
  //       // Route to the new chat's route
  //       router.push(`/chat/${currentChatId}`);
  //     }
  
  //     // Save the new message to the chat
  //     await fetch(`/api/chats/${currentChatId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newMessage),
  //     });
  
  //     setChatHistory([...chatHistory, newMessage]);
  //     setQuery('');
  //   }
  // };

  // const dummyResponses = [
  //   'That\'s an interesting question!',
  //   'I\'m not sure, but I\'ll find out for you.',
  //   'Here\'s what I found on that topic...',
  //   'Can you provide more details?',
  //   'That\'s a great topic to explore!'
  // ];


    // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (query.trim()) {
  //     let currentChatId = chatId;
  
  //     // If no chatId is provided, create a new chat
  //     if (!chatId) {
  //       const newChatResponse = await fetch('/api/chats', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const newChat = await newChatResponse.json();
  //       currentChatId = newChat.id;
  //       setChats((prevChats) => [...prevChats, newChat]);
  //       router.push(`/chat/${currentChatId}`);
  //     }
  
  //     // Update chat history with the new message immediately
  //     const newMessage = { query, response: <BsDot className='thinking'/> }; // Temporary response placeholder
  //     setChatHistory((prevHistory) => [...prevHistory, newMessage]);
  
  //     // Send the new message to the API
  //     fetch(`/api/chats/${currentChatId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message: query }),
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Update the response in the chat history
  //       setChatHistory((prevHistory) =>
  //         prevHistory.map((msg) =>
  //           msg.query === query ? { ...msg, response: data.response } : msg
  //         )
  //       );
  //     })
  //     .catch(error => {
  //       console.error('Error sending message:', error);
  //     });
  
  //     setQuery('');
  //   }
  // };


    // const [isTyping, setIsTyping] = useState(false);

  // useEffect(() => {
  //   if (chatId) {
  //     fetch(`/api/chats?chatId=${chatId}`)
  //       .then((res) => res.json())
  //       .then((data) => setChatHistory(data));
  //       // console.log(data)
  //   } else {
  //     console.log('no Chat id')
  //   }
  // }, [chatId]);


    // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (query.trim()) {
  //     let currentChatId = chatId;
  
  //     if (!chatId && user) {
  //       const { data: newChat, error } = await supabase
  //         .from('chats')
  //         .insert([{ name: 'New Chat', messages: [], user_id: user.id }])
  //         .single();
      
  //       if (newChat) {
  //         currentChatId = newChat.id;
  //         setChats((prevChats) => [...prevChats, newChat]);
  //         router.push(`/chat/${currentChatId}`);
  //       }
  //     }
  
  //     const newMessage = { query, response: 'Thinking...' };
  //     setChatHistory((prevHistory) => [...prevHistory, newMessage]);
  
  //     // Send the query to your API endpoint
  //     fetch(`/api/chats/${currentChatId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ query })
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Update the chat history with the response from OpenAI
  //       setChatHistory((prevHistory) =>
  //         prevHistory.map((msg) =>
  //           msg.query === query ? { ...msg, response: data.response } : msg
  //         )
  //       );
  //     })
  //     .catch(error => {
  //       console.error('Error sending message:', error);
  //     });
  
  //     setQuery('');
  //   }
  // };


    // const handleSubmit = async (e) => {
  //   console.log('In Handle Submit')
  //   e.preventDefault();
  //   if (query.trim() && user) {
  //     let currentChatId = chatId;
  
  //     if (!chatId) {
  //       const { data: newChat, error: newChatError } = await supabase
  //         .from('chats')
  //         .insert([{ name: 'New Chat', messages: [], user_id: user.id }])
  //         .single()
  //         .select();
  
  //       if (newChatError) {
  //         console.error('Error creating new chat:', newChatError);
  //         return;
  //       }
  
  //       currentChatId = newChat.id;
  //       setChats((prevChats) => [...prevChats, newChat]);
  //       router.push(`/chat/${currentChatId}`);
  //     }
  
  //     // Add the query to the chat history immediately with a placeholder response
  //     const newMessage = { query, response: 'Thinking...' };
  //     setChatHistory((prevHistory) => [...prevHistory, newMessage]);
  
  //     // Send the query to your API endpoint
  //     fetch(`/api/chats/${currentChatId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ message: query })
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Update the response for the specific query in the chat history
  //       setChatHistory((prevHistory) =>
  //         prevHistory.map((msg) =>
  //           msg.query === query ? { ...msg, response: data.response } : msg
  //         )
  //       );
  //     })
  //     .catch(error => {
  //       console.error('Error sending message:', error);
  //     });
  
  //     setQuery(''); // Clear the input field
  //   }
  // };

