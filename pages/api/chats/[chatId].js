import { supabase } from '../../../utils/supabaseClient';
import { Configuration, OpenAIApi } from 'openai';
const OpenAI = require('openai');
import fetch from 'node-fetch'; // Import fetch


export default async function handler(req, res) {
  const { chatId } = req.query;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });

  if (req.method === 'GET') {
    const { data: chat, error } = await supabase
      .from('chats')
      .select('messages')
      .eq('id', chatId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.status(200).json(chat.messages);
  } else if (req.method === 'POST') {
    const userMessage = req.body.message;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Convert the response to JSON
      console.log('OpenAI API response:', data);

      const botResponse = data.choices && data.choices.length > 0 && data.choices[0].message
        ? data.choices[0].message.content.trim()
        : 'Sorry, I could not generate a response.'; // Fallback response
      const newMessage = { query: userMessage, response: botResponse };

      if (chatId) {
        // If chatId is provided, save the message to the database
        const { error: updateError } = await supabase
          .rpc('append_message', {
            chat_id: chatId,
            new_message: JSON.stringify(newMessage)
          });

        if (updateError) {
          throw updateError;
        }
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      return res.status(500).json({ message: 'Error generating response' });
    }
  } else if (req.method === 'DELETE') {
    if (chatId) {
      const { data, error } = await supabase
        .from('chats')
        .delete()
        .match({ id: chatId });

      if (error) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      return res.status(200).json({ message: 'Chat deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Chat ID is required' });
    }
  } else {
    return res.setHeader('Allow', ['GET', 'POST', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}



// import fs from 'fs';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid'; // Import the UUID library to generate unique chat IDs
// const OpenAI = require('openai');
// // import { Configuration, OpenAIApi } from 'openai';
// import fetch from 'node-fetch'; // Import fetch

// const chatsFilePath = path.join(process.cwd(), 'public', 'chats.json');

// export default async function handler(req, res) {
//   const chats = JSON.parse(fs.readFileSync(chatsFilePath, 'utf8'));
//   const { chatId } = req.query;

//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
//     });

//   if (req.method === 'GET') {
//     if (chatId) {
//       const chat = chats.find((chat) => chat.id === chatId);
//       if (chat) {
//         res.status(200).json(chat.messages);
//       } else {
//         res.status(404).json({ message: 'Chat not found' });
//       }
//     } else {
//       res.status(200).json(chats); // Return all chats if no chatId is provided
//     }
//   } else if (req.method === 'POST') {
//     if (chatId) {
//       // console.log('REquest', req)
//       const userMessage = req.body.message;
//       console.log("user message", userMessage)
//       try {
//         const response = await fetch('https://api.openai.com/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           },
//           body: JSON.stringify({
//             model: 'gpt-3.5-turbo', // Adjust model as necessary
//             messages: [
//               { role: 'user', content: userMessage },
//             ],
//           }),
//         });
      
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('Response error:', errorText);
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
      
//         const data = await response.json();
//         console.log('OpenAI response:', data); // Log the response
      
//         const botResponse = data.choices && data.choices.length > 0 && data.choices[0].message
//           ? data.choices[0].message.content.trim()
//           : 'Sorry, I could not generate a response.'; // Fallback response
//         const newMessage = { query: userMessage, response: botResponse };

//         const chatIndex = chats.findIndex((chat) => chat.id === chatId);
//         if (chatIndex !== -1) {
//           chats[chatIndex].messages.push(newMessage);
//           fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2));
//           res.status(201).json(newMessage);
//         } else {
//           res.status(404).json({ message: 'Chat not found' });
//         }
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error generating response' });
//       }
//       } else {
//       // Create a new chat with a unique ID and blank messages
//       const newChat = {
//         id: uuidv4(),
//         name: `Chat ${chats.length + 1}`,
//         messages: [],
//       };
//       chats.push(newChat);
//       fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2));
//       res.status(201).json(newChat);
//     }
//   } else if (req.method === 'DELETE') {
//     console.log('In Chat Delete')
//     if (chatId) {
//       console.log(chatId)
//       const chatIndex = chats.findIndex((chat) => chat.id === chatId);
//       if (chatIndex !== -1) {
//         chats.splice(chatIndex, 1); // Remove the chat from the array
//         fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2)); // Update the file
//         res.status(200).json({ message: 'Chat deleted successfully' });
//       } else {
//         res.status(404).json({ message: 'Chat not found' });
//       }
//     } else {
//       res.status(400).json({ message: 'Chat ID is required' });
//     }
//   }
// }

  //   if (chatId) {
  //     const userMessage = req.body.message;

  //     try {
  //       const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: 'gpt-3.5-turbo',
  //           messages: [
  //             { role: 'user', content: userMessage },
  //           ],
  //         }),
  //       });
  
  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error('Response error:', errorText);
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  
  //       const data = await response.json(); // Convert the response to JSON
  //       console.log('OpenAI API response:', data);
  
  //       const botResponse = data.choices && data.choices.length > 0 && data.choices[0].message
  //         ? data.choices[0].message.content.trim()
  //         : 'Sorry, I could not generate a response.'; // Fallback response
  //       const newMessage = { query: userMessage, response: botResponse };

  //       const { error: updateError } = await supabase
  //         .rpc('append_message', {
  //           chat_id: chatId,
  //           new_message: JSON.stringify(newMessage)
  //         });

  //       if (updateError) {
  //         throw updateError;
  //       }

  //       res.status(201).json(newMessage);
  //     } catch (error) {
  //       console.error('Error generating response:', error);
  //       return res.status(500).json({ message: 'Error generating response' });
  //     }
  //   } else {
  //     return res.status(400).json({ message: 'Chat ID is required' });
  //   }
  // }