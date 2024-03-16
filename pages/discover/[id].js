import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';

const DiscoverSlug = () => {
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState(null)

    useEffect(() => {
      if (id) {
        supabase
          .from('discover')
          .select('*')
          .eq('id', id)
          .then(({ data, error }) => {
            if (data) {
              setArticle(data[0]);
            } else {
              console.log('No Data');
            }
          });
      }
    }, [id]);

    useEffect(() => {
      console.log('Thread State', article);
    }, [article]);

  return (
    <div>
        <Sidebar />
        <div className='discover-thread-container'>
            {article && <h1>{article.title}</h1>}
            <div className='discover-thread-links'>
                <Link href='/https://google.com' target="_blank" rel='noreferrer'>
                  <div className='discover-link-container'>
                    <div>
                    <img src="/favicon.ico" width={30}></img>
                    </div>
                    <p>Apple buys Canadian AI startup as part of Race</p>
                  </div>
                </Link>
            </div>
            {article && <pre>{article.summary}</pre>}

        </div>
    </div>
  )
}

export default DiscoverSlug