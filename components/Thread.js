import React, { useState, useRef, useEffect, useContext } from 'react';
import { BsArrowDown, BsArrowRight, BsArrowUp, BsHeart, BsHeartFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { AiFillDislike, AiOutlineDislike } from 'react-icons/ai';
import { supabase } from '../utils/supabaseClient';
import { UserContext } from '../context/UserContext';

const SentimentBubbles = () => {
  const sentiments = [
    { word: 'vibes', frequency: 5, sentiment: 'positive' },
    { word: 'fire', frequency: 3, sentiment: 'positive' },
    { word: 'best', frequency: 2, sentiment: 'positive' },
    { word: 'downtown', frequency: 1, sentiment: 'neutral' },
    { word: 'friends', frequency: 1, sentiment: 'positive' },
  ];

  return (
    <div className='sentiment-bubbles-container'>
      <h4>Sentiment</h4>
      <div className='sentiment-bubbles'>
      {sentiments.map((sentiment, index) => (
        <div key={index} className={`sentiment-bubble ${sentiment.sentiment}`}>
          {sentiment.word} ({sentiment.frequency})
        </div>
      ))}
      </div>
    </div>
  );
};

const ThreadChat = ({ message, user }) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false)

    const [votes, setVotes] = useState(0);
  
    const handleUpvote = () => {
      setVotes(votes + 1);
      setLiked(true)
    };
  
    const handleDownvote = () => {
      setVotes(votes - 1);
      setDisliked(true)

    };
  
    return (
      <div className='thread-chat-container'>
        {/* <button onClick={handleDownvote}><BsArrowDown /></button> */}
        <div className='thread-chat-img-container'>
        <img src='/favicon.ico' width={30}></img>
        </div>
        <div className='thread-chat-subcontainer'>
        <span className='thread-chat-name'>lauren</span>
        <div className='thread-chat'>
        <p>{message}</p>
        <div>
        <button onClick={handleUpvote}>{liked ? <BsHeartFill />:<BsHeart />}</button>
        <span className={votes > 1 ? 'green-vote' : votes < 1 ? 'red-vote' : 'neutral-vote'}>{votes}</span>
        <button onClick={handleDownvote}>{disliked ? <AiFillDislike />:<AiOutlineDislike />}</button>

        </div>
        </div>
        <span className='thread-chat-date'>4h</span>
        <span className='thread-chat-reply'>Reply</span>
        </div>
      </div>
    );
  };

const Thread = ({threadID}) => {
  const textareaRef = useRef(null);
  const [query, setQuery] = useState('')
    const [messages, setMessages] = useState([])
    const [thread, setThread] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
      {threadID &&
      supabase
        .from('thread_comments')
        .select('*')
        .eq('thread_id', threadID)
        .then(({ data, error }) => {
          if (data) {
            setMessages(data);
          } else {
            console.log('No Data')
          }
        });
      }
  }, []);

  useEffect(() => {
    {threadID &&
    supabase
      .from('threads')
      .select('*')
      .eq('id', threadID)
      .single()
      .then(({ data, error }) => {
        if (data) {
          console.log('Threads', data)
          setThread(data);
          console.log('Thread State', thread)
        } else {
          console.log('No Data')
        }
      });
    }
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!query.trim()) return;

  const { data, error } = await supabase
    .from('thread_comments')
    .insert([
      {
        thread_id: threadID,
        content: query,
        user_id: user.id, // Assuming you have the user's ID stored in a variable called user.id
      },
    ])
    .select('*'); // Add this line

  if (error) {
    console.error('Error submitting comment:', error);
  } else if (data && data.length > 0) {
    setMessages([...messages, data[0]]);
    setQuery('');
  } else {
    console.error('No data returned after insert operation');
  }
};

const handleInputChange = (e) => {
  const textarea = textareaRef.current;
  setQuery(e.target.value);
  textarea.style.height = 'auto';
  textarea.style.rows = '1';
  textarea.style.height = `${textarea.scrollHeight}px`;
};


  return (
    <div className='thread-container'>
      <h6>Thread</h6>
      <h2>{thread && thread.title}</h2>
      <div className='thread-summary-container'>
        <p>{thread && thread.summary}</p>
      </div>
      <div className='thread-messages-container'>
          {messages.map((message, i) => (
            message && <ThreadChat key={message.id} message={message.content} />
          ))}
      </div>
      {/* <div className={chatHistory.length < 1 ? 'search-form-initial' : 'search-form'}> */}
      <div className='search-form'>
      <form className='searchBarBottom' onSubmit={handleSubmit}>
        {/* <form className={chatHistory.length < 1 ? 'searchBar': 'searchBarBottom'} onSubmit={handleSubmit}> */}
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
  )
}

export default Thread