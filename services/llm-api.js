import axios from 'axios';

const API_URL = 'https://api.together.xyz/v1/chat/completions';
const API_KEY = '8036cda7ecd9b246001d1264d534dd4e07654191f95c8b8774aaac262542c757'; // set in env variables

const runLLM = async (prompt) => {
  const body = {
    model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    messages: [
      { role: 'system', content: 'You are a helpful and accurate assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.0
  };

  try {
    const response = await axios.post(API_URL, body, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('LLM API error:', error.response?.data || error.message);
    throw error;
  }
};

export default runLLM;
