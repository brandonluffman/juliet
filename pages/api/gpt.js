import fetch from 'node-fetch';

const openaiApiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const chatCompletion = async (userMessage) => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// Example usage
const userMessage = 'Hello, how are you?';
chatCompletion(userMessage).then((botResponse) => {
  console.log('AI Response:', botResponse);
}).catch((error) => {
  console.error('Error:', error);
});
