import '../styles/globals.css'
import '../styles/chat.css'
import '../styles/search.css'
import '../styles/sidebar.css'
import '../styles/index.css'
import '../styles/thread.css'
import '../styles/threads.css'
import '../styles/register.css'
import '../styles/login.css'
import '../styles/loading.css'
import '../styles/answer.css'
import '../styles/discover.css'

import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import Router from 'next/router';
// import Loading from '../components/Loading';
import { UserProvider } from '../context/UserContext';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


export default function App({ Component, pageProps, router }) {

  return (
    <UserProvider>
      {/* {isPageLoading ? (
        <Loading />
      ) : (
        <Component {...pageProps} />
      )} */}
              <Component {...pageProps} />

    </UserProvider>
  );

}
