import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DiscoverArticle from '../components/DiscoverArticle';
import { BsBrowserSafari } from 'react-icons/bs';
import { supabase } from '../utils/supabaseClient';


const Discover = () => {
    const [articles, setArticles] = useState([])
  useEffect(() => {
    supabase
      .from('discover')
      .select('*')
      .then(({ data, error }) => {
        if (data) {
          setArticles(data);
          console.log('Thread State', articles)
        } else {
          console.log('No Data')
        }
      });
}, []);

  return (
    <div className='discover-container'>
        <div className='discover-header-container'> <BsBrowserSafari /> Discover</div>
        <div className='discover-articles-grid'>
            {articles.map((article, i) => (
                <DiscoverArticle key={article.id} title={article.title} content={article.summary} id={article.id} />
            ))}
        {/* <DiscoverArticle id={id} />
        <DiscoverArticle id={id} />
        <DiscoverArticle id={id} />
        <DiscoverArticle id={id} />
        <DiscoverArticle id={id} />
        <DiscoverArticle id={id} /> */}

        </div>
   </div>
  )
}

export default Discover