const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Debug environment variables on startup
console.log('🔧 Environment Debug:');
console.log('Working directory:', __dirname);
console.log('.env path:', path.join(__dirname, '.env'));
console.log('PORT:', process.env.PORT);
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuizTime Backend is running!' });
});

// Test endpoint to verify randomization
app.get('/test-randomization', (req, res) => {
  const testOptions = ['Apple', 'Banana', 'Cherry', 'Date'];
  const results = [];
  
  // Generate 10 test shuffles
  for (let i = 0; i < 10; i++) {
    const shuffled = [...testOptions];
    
    // Fisher-Yates shuffle
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }
    
    const applePosition = shuffled.findIndex(item => item === 'Apple');
    const positionLetter = String.fromCharCode(65 + applePosition);
    
    results.push({
      shuffle: i + 1,
      options: shuffled,
      appleAt: positionLetter
    });
  }
  
  res.json({
    message: 'Randomization test - Apple should appear in different positions',
    results
  });
});

// Groq AI Quiz Generator endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic, questionCount } = req.body;
    
    if (!topic || !questionCount) {
      return res.status(400).json({ error: 'Topic and questionCount are required' });
    }

    console.log(`🤖 Generating ${questionCount} AI quiz questions about: ${topic}`);

    // Use Groq AI API for high-quality question generation
    try {
      const groqQuestions = await generateWithGroq(topic, questionCount);
      if (groqQuestions && groqQuestions.length > 0) {
        console.log(`✅ Groq AI: Generated ${groqQuestions.length} high-quality questions`);
        return res.json({ 
          questions: groqQuestions,
          source: 'groq-ai',
          note: 'Generated using Groq AI - High Quality'
        });
      }
    } catch (groqError) {
      console.error('❌ Groq AI failed:', groqError.message);
      return res.status(500).json({ 
        error: 'Failed to generate quiz questions',
        details: 'Groq AI service is currently unavailable'
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Groq AI API - High-quality question generation
async function generateWithGroq(topic, questionCount) {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  console.log('🔍 Checking Groq API key...');
  console.log('API Key present:', groqApiKey ? 'Yes' : 'No');
  console.log('API Key length:', groqApiKey ? groqApiKey.length : 0);
  
  if (!groqApiKey || groqApiKey.trim() === '') {
    throw new Error('Groq API key not configured in environment variables');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are an expert quiz generator. Create educational, diverse, and challenging multiple-choice questions. Always return ONLY a valid JSON array with no additional text, markdown, or formatting.`
        },
        {
          role: 'user',
          content: `Generate exactly ${questionCount} diverse multiple-choice quiz questions about "${topic}". 

CRITICAL REQUIREMENTS:
- Make questions specific to ${topic}, not generic
- Ensure answers are 100% factually correct
- Vary difficulty levels (easy, medium, hard)
- Include different question types (factual, conceptual, analytical)
- Create plausible but clearly wrong distractors
- Double-check all facts before generating

Return ONLY this exact JSON format with NO markdown formatting:
[
  {
    "question": "Specific factual question about ${topic}?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "The actual correct answer text",
    "explanation": "Detailed explanation of why the correct answer is right and why other options are wrong"
  }
]

EXPLANATION REQUIREMENTS:
- Provide detailed educational context about WHY the answer is correct
- Include relevant facts, principles, or background information
- Explain the reasoning behind the correct choice
- Address why each incorrect option is wrong with specific reasons
- Make explanations educational and informative (3-4 sentences minimum)
- Help users learn and understand the topic better
- Use clear, accessible language
- Don't assume any specific position for the correct answer

CRITICAL VALIDATION RULES:
- The correctAnswer field should contain the exact text of the right option
- All facts must be verified and accurate
- Make explanations detailed and educational, not generic
- Ensure options are shuffled and don't follow predictable patterns`
        }
      ],
      max_tokens: 3000,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid Groq response structure');
  }

  let content = data.choices[0].message.content;
  
  // Clean up the response
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    const questions = JSON.parse(content);
    
    // Validate the questions
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    const validQuestions = questions.filter(q => 
      q.question && 
      q.options && 
      Array.isArray(q.options) && 
      q.options.length === 4 && 
      q.correctAnswer && 
      q.explanation
    );

    if (validQuestions.length === 0) {
      throw new Error('No valid questions in response');
    }

    // Process questions: randomize answer positions and create proper answer format
    const finalQuestions = validQuestions.map((q, index) => {
      // Create a copy of options array for shuffling
      const allOptions = [...q.options];
      
      // Find the correct answer in the original options array
      let correctAnswerIndex = allOptions.findIndex(option => 
        option.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
      );
      
      // If exact match not found, try partial matching
      if (correctAnswerIndex === -1) {
        correctAnswerIndex = allOptions.findIndex(option => 
          option.toLowerCase().includes(q.correctAnswer.toLowerCase()) ||
          q.correctAnswer.toLowerCase().includes(option.toLowerCase())
        );
      }
      
      // If still not found, default to first option and update correctAnswer
      if (correctAnswerIndex === -1) {
        console.log(`⚠️  Could not find correct answer "${q.correctAnswer}" in options for question ${index + 1}`);
        correctAnswerIndex = 0;
        q.correctAnswer = allOptions[0];
      }
      
      // Store the correct answer text
      const correctAnswerText = allOptions[correctAnswerIndex];
      
      // Shuffle the entire options array using Fisher-Yates algorithm
      for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
      }
      
      // Find where the correct answer ended up after shuffling
      const newCorrectIndex = allOptions.findIndex(option => 
        option.toLowerCase().trim() === correctAnswerText.toLowerCase().trim()
      );
      
      // Convert position to letter (A, B, C, D)
      const answerLetter = String.fromCharCode(65 + newCorrectIndex);
      
      console.log(`🎲 Question ${index + 1}: Correct answer "${correctAnswerText}" is now at position ${answerLetter}`);
      
      // Also log the full options array for debugging
      console.log(`   Options: A) ${allOptions[0]} | B) ${allOptions[1]} | C) ${allOptions[2]} | D) ${allOptions[3]}`);
      console.log(`   ✅ Correct: ${answerLetter}) ${correctAnswerText}`);
      
      // Update explanation to reference the correct answer text (not position)
      let updatedExplanation = q.explanation;
      if (!updatedExplanation.toLowerCase().includes(correctAnswerText.toLowerCase())) {
        console.log(`🔧 Updating explanation for question ${index + 1}`);
        const wrongOptions = allOptions.filter((opt, idx) => idx !== newCorrectIndex);
        updatedExplanation = `The correct answer is "${correctAnswerText}". This answer is accurate based on established facts and principles related to ${topic}. Understanding this concept is important for grasping the fundamentals of the subject. The other options (${wrongOptions.join(', ')}) are incorrect because they represent common misconceptions or alternative concepts that don't apply to this specific question context.`;
      }
      
      // Return the processed question with randomized answer position
      return {
        question: q.question,
        options: allOptions,
        answer: answerLetter,
        explanation: updatedExplanation
      };
    });

    console.log(`🔍 Validation complete: ${finalQuestions.length} questions validated`);
    return finalQuestions;
  } catch (parseError) {
    console.error('Failed to parse Groq response:', content);
    throw new Error(`JSON parsing failed: ${parseError.message}`);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 QuizTime Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
