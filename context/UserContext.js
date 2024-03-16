import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';
import Router from 'next/router';
// import { useRouter } from 'next/router';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserPaid, setIsUserPaid] = useState(false); // New state for paid status
  const [paidPlanType, setPaidPlanType] = useState('');


  useEffect(() => {
    console.log("Checking stored user in localStorage");
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setPaidPlanType(parsedUser.planType || ''); // Update the paidPlanType state
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('user');
      }
    } 
    else {
      console.log("No stored user found");
    }
  }, []);

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
            setUser(session.user);
            localStorage.setItem('user', JSON.stringify(session.user));
        } else {
            setUser(null);
            localStorage.removeItem('user');
        }
    });

    return () => {
        if (authListener && typeof authListener.unsubscribe === 'function') {
            authListener.unsubscribe();
        }
    };
}, []);

const login = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login error:', error.message);
      alert('Login failed. Please check your credentials.');
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error signing in:', error.message);
    return false;
  }
};

  


  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
      Router.push('/login')
    } catch (error) {
      console.error("Logout error:", error);
    }
  };




  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};








  // async function fetchUserPlanType(userId) {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .select('paid_plan_type') // Ensure this matches your table's column name
  //     .eq('auth_id', userId)
  //     .single();
  
  //   if (error) {
  //     console.error('Error fetching user plan type:', error);
  //     return '';
  //   }
  
  //   return data ? data.paid_plan_type : ''; // Make sure this matches the selected column
  // }
  

//   async function fetchUserPaidStatus(userId) {
//     const { data, error } = await supabase
//       .from('users')
//       .select('paid_user')
//       .eq('auth_id', userId)
//       .single();
  
//     if (error) {
//       console.error('Error fetching user paid status:', error);
//       return false;
//     }
  
//     return data ? data.paid_user : false;
//   }
//   const updateUser = (updatedUser) => {
//     setUser(updatedUser);
// };



  // const deleteUserRelatedData = async (userId) => {
  //   try {

  //     let { data: chats, error: chatIdsError } = await supabase
  //     .from('chats')
  //     .select('id')
  //     .eq('user_id', userId);
  //   if (chatIdsError) throw chatIdsError;

  //   // Extract the ids from the data
  //   const ids = chats.map(chat => chat.id);

  //   if (ids.length > 0) {
  //     // Delete user data from the 'site_urls' table
  //     let { error: siteUrlsError } = await supabase
  //       .from('site_urls')
  //       .delete()
  //       .in('app_id', ids);
  //     if (siteUrlsError) throw siteUrlsError;
  //   }
  //     // Delete user data from the 'apps' table
  //     let { error: appsError } = await supabase
  //       .from('apps')
  //       .delete()
  //       .match({ user_id: userId });
  //     if (appsError) throw appsError;
  
  //     // Delete user data from the 'blogs' table
  //     let { error: blogsError } = await supabase
  //       .from('blogs')
  //       .delete()
  //       .match({ user_id: userId });
  //     if (blogsError) throw blogsError;
  
  //     // Delete user data from the 'users' table
  //     let { error: usersError } = await supabase
  //       .from('users')
  //       .delete()
  //       .match({ auth_id: userId });
  //     if (usersError) throw usersError;
  
  //   } catch (error) {
  //     console.error("Error deleting user data:", error);
  //     throw error; // Re-throw the error to be caught by the calling function

  //     // Handle any errors
  //   }
  // };