import React, {useState, useEffect} from 'react'
import AnswerThread from './AnswerThread';
import { supabase } from '../utils/supabaseClient';

const Threads = () => {
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
    <div className='threads-container'>
      <div>
        <h2>Threads</h2>
        <div className='threads-headers'>
        <div>
          <h4>Local Threads</h4>
          <div className='threads-vertical-grid'>
          {threads && threads.map((thread, i) => (
                  <AnswerThread key={thread.id} title={thread.title} time={4} comments={thread.comment_count} points={288} tags={thread.tags} id={thread.id} />
          ))}
          </div>
          </div>
          <div>
          <h4>Global Threads</h4>
          <div className='threads-vertical-grid'>
          {threads && threads.map((thread, i) => (
                  <AnswerThread key={thread.id} title={thread.title} time={4} comments={thread.comment_count} points={288} tags={thread.tags} id={thread.id} />
          ))}
          </div>
        </div>
        </div>
        <h4>Threads For You</h4>
        <div className='answer-threads-grid'>
        {threads && threads.map((thread, i) => (
                  <AnswerThread key={thread.id} title={thread.title} time={4} comments={thread.comment_count} points={288} tags={thread.tags} id={thread.id} />
          ))}
          </div>
        </div>
    </div>
  )
}

export default Threads