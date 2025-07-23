// Simple API test utility
async function testOpenAIAPI() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Say "API test successful"'
          }
        ],
        max_tokens: 50,
      }),
    });
    
    const data = await response.json();
    console.log('API Test Result:', data);
    return data;
  } catch (error) {
    console.error('API Test Error:', error);
    return error;
  }
}

// Make available globally for testing
window.testOpenAIAPI = testOpenAIAPI;
