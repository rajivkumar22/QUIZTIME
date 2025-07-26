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

    // Normalize the topic: trim whitespace and convert to proper case
    const normalizedTopic = normalizeTopic(topic.trim());
    
    // Validate if the normalized topic is meaningful and relevant
    const isValidTopic = await validateTopic(normalizedTopic);
    if (!isValidTopic) {
      return res.status(400).json({ 
        error: 'Please enter a relevant and meaningful topic',
        details: 'The topic you entered appears to be invalid, meaningless, or not suitable for quiz generation. Please try topics like "Science", "History", "Mathematics", "Geography", etc.'
      });
    }

    console.log(`🤖 Generating ${questionCount} AI quiz questions about: ${normalizedTopic}`);

    // Use Groq AI API for high-quality question generation
    try {
      const groqQuestions = await generateWithGroq(normalizedTopic, questionCount);
      if (groqQuestions && groqQuestions.length > 0) {
        console.log(`✅ Groq AI: Generated ${groqQuestions.length} high-quality questions`);
        return res.json({ 
          questions: groqQuestions,
          source: 'groq-ai',
          note: 'Generated using Groq AI - High Quality',
          topic: normalizedTopic // Return the normalized topic
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

// Function to normalize topic input - handles case sensitivity and formatting
function normalizeTopic(topic) {
  if (!topic) return '';
  
  // Convert to lowercase first for consistent processing
  const normalized = topic.toLowerCase().trim();
  
  // Remove extra spaces and clean up
  const cleaned = normalized.replace(/\s+/g, ' ');
  
  // Handle special cases and common topics with comprehensive mapping
  const specialCases = {
    // Sports (all variations)
    'football': 'Football',
    'soccer': 'Soccer', 
    'basketball': 'Basketball',
    'baseball': 'Baseball',
    'tennis': 'Tennis',
    'cricket': 'Cricket',
    'hockey': 'Hockey',
    'volleyball': 'Volleyball',
    'swimming': 'Swimming',
    'running': 'Running',
    'boxing': 'Boxing',
    'wrestling': 'Wrestling',
    'golf': 'Golf',
    'badminton': 'Badminton',
    'table tennis': 'Table Tennis',
    'ping pong': 'Ping Pong',
    
    // Academic subjects with variations
    'mathematics': 'Mathematics',
    'math': 'Mathematics',
    'maths': 'Mathematics',
    'science': 'Science',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'history': 'History',
    'geography': 'Geography',
    'english': 'English',
    'literature': 'Literature',
    'art': 'Art',
    'music': 'Music',
    'philosophy': 'Philosophy',
    'psychology': 'Psychology',
    'economics': 'Economics',
    'sociology': 'Sociology',
    'political science': 'Political Science',
    'computer science': 'Computer Science',
    'cs': 'Computer Science',
    
    // Technology with common variations
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'python': 'Python',
    'java': 'Java',
    'html': 'HTML',
    'css': 'CSS',
    'react': 'React',
    'reactjs': 'React',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node js': 'Node.js',
    'database': 'Database',
    'databases': 'Database',
    'sql': 'SQL',
    'mysql': 'MySQL',
    'machine learning': 'Machine Learning',
    'ml': 'Machine Learning',
    'artificial intelligence': 'Artificial Intelligence',
    'ai': 'Artificial Intelligence',
    'programming': 'Programming',
    'coding': 'Programming',
    'web development': 'Web Development',
    'web dev': 'Web Development',
    
    // Emotions/Psychology with variations
    'happiness': 'Happiness',
    'happy': 'Happiness',
    'joy': 'Happiness',
    'sadness': 'Sadness', 
    'sad': 'Sadness',
    'sorrow': 'Sadness',
    'love': 'Love',
    'friendship': 'Friendship',
    'friends': 'Friendship',
    'anger': 'Anger',
    'angry': 'Anger',
    'rage': 'Anger',
    'fear': 'Fear',
    'afraid': 'Fear',
    'anxiety': 'Anxiety',
    'anxious': 'Anxiety',
    'depression': 'Depression',
    'depressed': 'Depression',
    'confidence': 'Confidence',
    'confident': 'Confidence',
    'stress': 'Stress',
    'stressed': 'Stress',
    'leadership': 'Leadership',
    'leader': 'Leadership',
    'motivation': 'Motivation',
    'motivated': 'Motivation',
    
    // Health and wellness
    'health': 'Health',
    'fitness': 'Fitness',
    'exercise': 'Exercise',
    'nutrition': 'Nutrition',
    'diet': 'Diet',
    'medicine': 'Medicine',
    'medical': 'Medicine',
    'mental health': 'Mental Health',
    
    // Common topics with variations
    'cooking': 'Cooking',
    'food': 'Food',
    'travel': 'Travel',
    'traveling': 'Travel',
    'travelling': 'Travel',
    'nature': 'Nature',
    'animals': 'Animals',
    'animal': 'Animals',
    'space': 'Space',
    'universe': 'Space',
    'environment': 'Environment',
    'environmental': 'Environment',
    'climate change': 'Climate Change',
    'global warming': 'Global Warming',
    'business': 'Business',
    'management': 'Management',
    'marketing': 'Marketing',
    'finance': 'Finance',
    'money': 'Finance',
    
    // Entertainment and culture
    'movies': 'Movies',
    'film': 'Movies',
    'films': 'Movies',
    'books': 'Books',
    'reading': 'Books',
    'games': 'Games',
    'gaming': 'Games',
    'video games': 'Video Games',
    'sports': 'Sports',
    'entertainment': 'Entertainment',
    
    // Science fields
    'astronomy': 'Astronomy',
    'geology': 'Geology',
    'meteorology': 'Weather',
    'weather': 'Weather',
    'anatomy': 'Human Anatomy',
    'human anatomy': 'Human Anatomy',
    'physiology': 'Physiology',
    'genetics': 'Genetics',
    'evolution': 'Evolution',
    
    // Common abbreviations and variations
    'usa': 'United States',
    'america': 'United States',
    'uk': 'United Kingdom',
    'britain': 'United Kingdom',
    'eu': 'European Union',
    'ww2': 'World War II',
    'wwii': 'World War II',
    'world war 2': 'World War II',
    'ww1': 'World War I',
    'wwi': 'World War I',
    'world war 1': 'World War I'
  };
  
  // Check for exact match in special cases
  if (specialCases[cleaned]) {
    console.log(`📝 Normalized "${topic}" → "${specialCases[cleaned]}" (from predefined list)`);
    return specialCases[cleaned];
  }
  
  // Handle unknown topics intelligently
  console.log(`🔍 Topic "${topic}" not in predefined list, applying intelligent normalization...`);
  
  // Handle compound words and phrases intelligently
  if (cleaned.includes(' ')) {
    // Multi-word topics - capitalize each significant word
    const result = cleaned
      .split(' ')
      .map(word => {
        // Don't capitalize small connecting words unless they're first
        const smallWords = ['and', 'or', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among'];
        if (smallWords.includes(word) && cleaned.indexOf(word) !== 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    
    console.log(`📝 Normalized unknown multi-word topic "${topic}" → "${result}"`);
    return result;
  }
  
  // For single unknown words, apply intelligent capitalization
  // Check if it might be an acronym (all caps in original)
  if (topic.toUpperCase() === topic && topic.length <= 5) {
    console.log(`📝 Detected acronym "${topic}" → keeping as "${topic.toUpperCase()}"`);
    return topic.toUpperCase();
  }
  
  // For regular single words, capitalize first letter
  const result = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  console.log(`📝 Normalized unknown single word "${topic}" → "${result}"`);
  return result;
}

// Topic validation function to check if topic is meaningful
async function validateTopic(topic) {
  // Basic validation checks
  if (!topic || topic.length < 2) {
    return false;
  }
  
  // Check for obviously meaningless patterns only
  const meaninglessPatterns = [
    /^[a-z]\1{4,}$/i, // Repeated characters like "aaaaa" or "jjjjj"
    /^[0-9]+$/, // Only numbers
    /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, // Only special characters
    /^(.)\1{3,}$/i, // Same character repeated 4+ times (like "jjjj")
    /^[a-z]{1}$/i, // Single character only
    /qwerty|asdf|zxcv|12345|abcde/i, // Obvious keyboard patterns
  ];
  
  // Check if topic matches obviously meaningless patterns
  for (const pattern of meaninglessPatterns) {
    if (pattern.test(topic)) {
      return false;
    }
  }
  
  // Use Groq AI to intelligently validate if the topic can generate educational content
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey || groqApiKey.trim() === '') {
      // If API key not available, use basic validation only
      return topic.length >= 2 && /[a-zA-Z]/.test(topic);
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
            content: `You are an intelligent topic validator for educational quiz generation. Analyze topics deeply and determine if they can generate meaningful educational quiz questions. 

VALIDATION CRITERIA:
- Can this topic generate educational, factual quiz questions?
- Does it represent a real concept, emotion, subject, field, or phenomenon?
- Can students learn something meaningful from questions about this topic?
- Is it suitable for educational content?

ACCEPT topics like:
- Academic subjects (Math, Science, History, etc.)
- Emotions and psychology (sad, happy, anger, depression, etc.)
- Real concepts and phenomena (love, friendship, leadership, etc.)
- Technologies, skills, hobbies
- Health, wellness, lifestyle topics
- Current events, social issues
- Any genuine topic that can have educational value

REJECT only:
- Random meaningless character sequences
- Obvious spam or nonsense
- Inappropriate or harmful content
- Topics that genuinely cannot generate any educational content

Respond with only "VALID" or "INVALID".`
          },
          {
            role: 'user',
            content: `Analyze this topic deeply: "${topic}"

Can this topic generate meaningful, educational quiz questions? Consider:
1. Is it a real concept, emotion, subject, phenomenon, activity, or field?
2. Can it lead to factual, educational questions?
3. Would students learn something valuable?
4. Does it have educational potential?

ACCEPT topics like:
- Academic subjects (Math, Science, History, etc.)
- Emotions and psychology (sad, happy, anger, depression, etc.)
- Real concepts and phenomena (love, friendship, leadership, etc.)
- Technologies, skills, hobbies (programming, cooking, photography, etc.)
- Health, wellness, lifestyle topics
- Current events, social issues
- Niche topics with educational value (origami, beekeeping, gardening, etc.)
- Cultural topics (festivals, traditions, arts, etc.)
- Any genuine topic that exists and can teach something meaningful

REJECT only:
- Random meaningless character sequences (like "jjjjjjj", "aaaaaaa")
- Obvious spam or nonsense input
- Inappropriate or harmful content
- Topics that genuinely cannot generate any educational content

IMPORTANT: Even if the topic is uncommon or not mainstream, if it's a real concept/activity/field that exists and can teach something educational, it should be VALID.

Examples:
- "Origami" → VALID (paper folding art, mathematical principles, cultural history)
- "Beekeeping" → VALID (bee biology, honey production, agriculture)
- "Meditation" → VALID (mindfulness, neuroscience, health benefits)
- "Cryptocurrency" → VALID (blockchain, technology, economics)
- "jjjjjjjjj" → INVALID (meaningless characters)
- "asdfgh" → INVALID (keyboard mashing)

Respond with only "VALID" or "INVALID".`
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      // If API call fails, use basic validation
      return topic.length >= 2 && /[a-zA-Z]/.test(topic);
    }

    const data = await response.json();
    const result = data.choices[0].message.content.trim().toUpperCase();
    
    console.log(`🔍 Deep topic validation for "${topic}": ${result}`);
    return result === 'VALID';
    
  } catch (error) {
    console.error('Topic validation error:', error.message);
    // Fallback to basic validation if AI validation fails
    return topic.length >= 2 && /[a-zA-Z]/.test(topic);
  }
}

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
          content: `You are an expert educational quiz generator and learning facilitator. Your mission is to create engaging, interactive, and genuinely educational quiz questions that help users learn and remember important information about any topic.

CORE PRINCIPLES:
- EDUCATIONAL EXCELLENCE: Every question must teach something valuable and memorable
- UNIVERSAL ADAPTABILITY: Handle any topic intelligently, from common subjects to niche specialties
- INTERACTIVE LEARNING: Create questions that engage users and make them think
- GENUINE UNDERSTANDING: Focus on concepts that truly matter and enhance knowledge
- ACCESSIBLE WISDOM: Make complex topics understandable without losing educational depth

YOUR EXPERTISE INCLUDES:
- Academic subjects (all levels from basic to advanced)
- Professional skills and career knowledge
- Science, technology, and innovation
- Arts, culture, and creativity
- Health, wellness, and lifestyle
- Sports, hobbies, and recreational activities
- Psychology, emotions, and personal development
- Current events and social topics
- Niche specialties and emerging fields

QUALITY STANDARDS:
- All information must be factually accurate and verified
- Questions should spark curiosity and encourage further learning
- Explanations should be educational goldmines full of interesting insights
- Content must be culturally sensitive and globally relevant
- Learning outcomes should be clear and valuable

Always return ONLY a valid JSON array with no additional text, markdown, or formatting. Focus on creating quiz experiences that users will find both educational and genuinely interesting.`
        },
        {
          role: 'user',
          content: `Generate exactly ${questionCount} diverse multiple-choice quiz questions about "${topic}". 

INTELLIGENT TOPIC ANALYSIS: Analyze "${topic}" deeply and adapt your approach for maximum learning:

TOPIC CATEGORIZATION & APPROACH:
- ACADEMIC SUBJECTS (Math, Science, History, etc.): Focus on core concepts, formulas, historical facts, practical applications
- SPORTS & ACTIVITIES (Football, Basketball, Swimming, etc.): Cover rules, techniques, history, famous personalities, strategies, health benefits
- EMOTIONS & PSYCHOLOGY (Happiness, Sadness, Stress, etc.): Include neuroscience, mental health research, coping strategies, psychological theories
- TECHNOLOGY & PROGRAMMING (JavaScript, AI, Blockchain, etc.): Cover practical concepts, real-world applications, best practices, industry trends
- HEALTH & WELLNESS (Nutrition, Fitness, Medicine, etc.): Include scientific research, health benefits, risks, evidence-based practices
- CREATIVE ARTS (Music, Painting, Writing, etc.): Cover techniques, history, famous artists, cultural impact, creative processes
- LIFESTYLE & HOBBIES (Cooking, Gardening, Travel, etc.): Focus on practical knowledge, tips, cultural aspects, benefits
- NICHE/SPECIALIZED TOPICS: Research thoroughly and focus on fundamental concepts, history, practical applications, interesting facts

SMART CONTENT GENERATION STRATEGY:
1. ACCESSIBILITY: Make content understandable for general audience while maintaining educational depth
2. INTERACTIVITY: Create engaging questions that make users think and learn
3. REAL-WORLD RELEVANCE: Connect concepts to practical applications and daily life
4. PROGRESSIVE DIFFICULTY: Include easy, medium, and challenging questions
5. COMPREHENSIVE COVERAGE: Address different aspects of the topic (history, science, practice, culture, etc.)
6. MEMORABLE LEARNING: Include interesting facts and "aha moments" that stick with learners

INTELLIGENT QUESTION TYPES:
- FACTUAL: "What is...?", "Who invented...?", "When did...?"
- CONCEPTUAL: "Why does...?", "How does...work?", "What causes...?"
- ANALYTICAL: "What would happen if...?", "Which approach is best for...?", "How do these compare...?"
- PRACTICAL: "In real life, how would you...?", "What's the best practice for...?"
- CREATIVE: "What's an example of...?", "How might you apply...?"

EDUCATIONAL ENHANCEMENT:
- Make each question teach something valuable and memorable
- Include surprising or little-known facts
- Connect concepts to broader understanding
- Provide practical examples and applications
- Use clear, engaging language that sparks curiosity
- Ensure cultural sensitivity and global perspective

CRITICAL REQUIREMENTS FOR ANY TOPIC:
- Research the topic thoroughly to find educational angles
- Generate questions that genuinely teach valuable information about ${topic}
- Ensure 100% factual accuracy with verified information
- Create plausible but clearly incorrect distractors
- Make explanations rich in educational content
- Include different difficulty levels and question types
- Focus on genuine learning outcomes

Return ONLY this exact JSON format with NO markdown formatting:
[
  {
    "question": "Engaging, educational question about ${topic} that teaches valuable concepts?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "The actual correct answer text",
    "explanation": "Rich, detailed explanation with educational context and interesting facts"
  }
]

ENHANCED EXPLANATION REQUIREMENTS:
- Start with clear confirmation of the correct answer
- Explain WHY this answer is correct with scientific/factual backing
- Include interesting background information or context
- Address why incorrect options are wrong with specific reasons
- Add a "learning bonus" - an extra interesting fact or practical application
- Use storytelling or analogies when helpful for understanding
- Connect to broader knowledge or real-world applications
- Make explanations memorable and engaging (4-6 sentences)
- End with something that encourages further exploration of the topic

VALIDATION & QUALITY ASSURANCE:
- All facts must be verified and accurate
- Questions should genuinely enhance understanding of ${topic}
- Explanations should be educational goldmines that users remember
- Content should be appropriate for general educational purposes
- Ensure questions work for both beginners and those with some knowledge
- Make learning interactive, engaging, and genuinely valuable`
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
