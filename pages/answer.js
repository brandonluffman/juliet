import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Search from '../components/Search';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import AnswerThread from '../components/AnswerThread';


const Answer = () => {
    const router = useRouter();
    const { chatId } = router.query;
    const [chats, setChats] = useState([]);
    const [threads, setThreads] = useState([]);



    useEffect(() => {
        supabase
          .from('threads')
          .select('*')
          .limit(5)
          .then(({ data, error }) => {
            if (data) {
              console.log('Threads', data)
              setThreads(data);
              console.log('Thread State', threads)
            } else {
              console.log('No Data')
            }
          });
    }, []);
  

  return (
    <div>
            <Sidebar />
            <div className='answer-container'>
              <h1>Trending Threads</h1>
              <div className='answer-threads-grid-container'>
              <h2>Based on your preferences</h2>
              <div className='answer-threads-grid'>
              {threads && threads.map((thread, i) => (
                  <AnswerThread key={thread.id} title={thread.title} time={4} comments={thread.comment_count} points={288} tags={thread.tags} id={thread.id} />
              ))}
              </div>
              <h2>Based on your location</h2>
              <div className='answer-threads-grid'>
              {threads && threads.map((thread, i) => (
                  <AnswerThread key={thread.id} title={thread.title} time={4} comments={thread.comment_count} points={288} tags={thread.tags} id={thread.id} />
              ))}
              </div>
              <h2>Based on your expertise</h2>
              <div className='answer-threads-grid'>
              {threads && threads.map((thread, i) => (
                  <AnswerThread key={thread.id} title={thread.title} time={4} comments={thread.comment_count} points={288} tags={thread.tags} id={thread.id} />
              ))}
              </div>
              </div>
              <Link href='/threads'><button className='btn'>Explore More</button></Link>
            </div>
    </div>
  )
}

export default Answer