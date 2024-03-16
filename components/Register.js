import React, { useState, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';
import { IoIosUnlock } from 'react-icons/io';
import { AiFillEye } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import Loading from './Loading';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [job, setJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Register user with Supabase and add additional details in the metadata
    const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username,
                age: age,
                gender: gender,
                location: location,
                job: job,
            }
        }
    });

    if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
    } else {
        console.log('User registered with additional details:', user);
        // Redirect user or show success message
        setEmail('');
        setPassword('');
        setUsername('');
        setGender('');
        setAge('');
        setLocation('');
        setJob('');

        setLoading(false);
    }
};



//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Register user with Supabase
//     const { user, error: signUpError } = await supabase.auth.signUp({
//         email,
//         password,
//     });

//     if (signUpError) {
//         setError(signUpError.message);
//         setLoading(false);
//     } else {
//         const { data: currentUser, error: userError } = await supabase.auth.getUser();

//         if (userError) {
//             setError(userError.message);
//         } else {
//             console.log('User registered:', currentUser);

//             // Insert additional user details into the profiles table
//             const { data, error: insertError } = await supabase.from('profiles').insert([
//                 {
//                     user_id: currentUser.id,
//                     username,
//                     gender,
//                     age,
//                     location,
//                     job,
//                 },
//             ]);

//             if (insertError) {
//                 setError(insertError.message);
//             } else {
//                 console.log('Profile details added:', data);
//                 // Redirect user or show success message
//                 setEmail('');
//                 setPassword('');
//                 setUsername('');
//                 setGender('');
//                 setAge('');
//                 setLocation('');
//                 setJob('');
//             }
//         }

//         setLoading(false);
//     }
// };

  return (
    <div className='login-container'>
                {loading && <Loading />}

      <div className='login-box'>
        <h1>Register</h1>
        <form onSubmit={handleRegister} >
            <div className='login-input-div'>
                <CiMail className='login-icon mail-icon' />
                <input className='login-input login-email-input' placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className='login-input-div'>
                <IoIosUnlock className='login-icon lock-icon' />
                <input className='login-input login-password-input' placeholder='Password' type={visible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className='password-vis-button' type='button' onClick={() => setVisible(!visible)}><AiFillEye className='visibility-icon' /></button>
            </div>

            <div className='login-input-div'>
                <input className='login-input' placeholder='Username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className='login-input-div'>
                <select className='login-input' value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value='' disabled>Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                </select>
            </div>

            <div className='login-input-div'>
                <input className='login-input' placeholder='Age' type='number' value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <div className='login-input-div'>
                <input className='login-input' placeholder='Location' type='text' value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className='login-input-div'>
                <input className='login-input' placeholder='Job/Speciality' type='text' value={job} onChange={(e) => setJob(e.target.value)} />
            </div>

            <Link href='/login'><p className='create-account'>Already have an account?</p></Link>
            <button type='submit' className='login-button'>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
