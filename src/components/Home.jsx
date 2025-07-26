import React, { useState } from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: calc(100vh - 100px);
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const TopicInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const QuestionCountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

const QuestionSlider = styled.input`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #e1e5e9;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

const QuestionCount = styled.span`
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
  min-width: 80px;
  text-align: center;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  margin-top: 2rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #fed7d7;
`;

const ExampleTopics = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
`;

const ExampleTitle = styled.h3`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.8rem;
  font-weight: 500;
`;

const ExampleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const ExampleTopic = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: none;
    box-shadow: none;
  }
`;

const Mascot = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
`;

const DifficultyContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const DifficultyOption = styled.button`
  background: ${props => props.selected ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'white'};
  color: ${props => props.selected ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const DifficultyLabel = styled.div`
  font-size: 0.85rem;
  margin-top: 0.25rem;
  opacity: 0.8;
`;

const Home = ({ onStartQuiz }) => {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleTopics = [
    'Happiness', 'Sadness', 'Love', 'Friendship', 'Leadership',
    'JavaScript Programming', 'Photosynthesis', 'French Revolution', 
    'Solar System', 'World War II', 'Human Anatomy', 'Cooking',
    'Depression', 'Anxiety', 'Confidence', 'Machine Learning'
  ];

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a quiz topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Generating AI quiz for topic:', topic);
      
      // Call our backend API for real OpenAI generation
      const response = await fetch('http://localhost:3001/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          questionCount: questionCount,
          difficulty: difficulty
        }),
      });

      console.log('Backend Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend Error:', errorData);
        throw new Error(errorData.error || `Backend Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend Response:', data);
      
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions received from backend');
      }

      console.log('✅ Successfully received', data.questions.length, 'AI-generated questions');
      
      // Use the normalized topic from backend if available
      const finalTopic = data.topic || topic;
      console.log(`📚 Quiz topic normalized to: "${finalTopic}"`);
      
      setLoading(false);
      onStartQuiz(finalTopic, questionCount, data.questions, difficulty);

    } catch (err) {
      setLoading(false);
      console.error('❌ Error generating AI quiz:', err);
      
      let errorMessage = `AI Generation Failed: ${err.message}`;
      
      if (err.message.includes('Please enter a relevant and meaningful topic')) {
        errorMessage = '⚠️ Please enter a relevant and meaningful topic. Try topics like "Science", "History", "Mathematics", "Geography", etc.';
      } else if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        errorMessage = '⚠️ Backend server not running. Please start the backend server first.';
      } else if (err.message.includes('429') || err.message.includes('quota')) {
        errorMessage = '⚠️ Groq quota exceeded. Please check your Groq billing.';
      } else if (err.message.includes('401') || err.message.includes('API key')) {
        errorMessage = '⚠️ Invalid Groq API key. Please check your API key configuration.';
      }
      
      setError(errorMessage);
      
      // NO FALLBACK - Force user to fix the AI integration
      console.log('🚫 Not using fallback questions - AI integration must work');
    }
  };

  const handleExampleClick = (exampleTopic) => {
    setTopic(exampleTopic);
  };

  return (
    <HomeContainer>
      <ContentCard>
        <Mascot>🎯</Mascot>
        <Title>AI Quiz Generator</Title>
        <Subtitle>
          Enter any topic, and let AI craft your perfect quiz in seconds.
        </Subtitle>

        <InputGroup>
          <Label htmlFor="topic-input">Quiz Topic</Label>
          <TopicInput
            id="topic-input"
            type="text"
            placeholder="e.g., FoOtBaLl, JAVASCRIPT, photosynthesis..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && generateQuiz()}
            aria-describedby="topic-help"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="question-count">Number of Questions</Label>
          <QuestionCountContainer>
            <QuestionSlider
              id="question-count"
              type="range"
              min="3"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              aria-describedby="count-display"
            />
            <QuestionCount id="count-display">
              {questionCount} questions
            </QuestionCount>
          </QuestionCountContainer>
        </InputGroup>

        <InputGroup>
          <Label>Select Difficulty</Label>
          <DifficultyContainer>
            <DifficultyOption
              selected={difficulty === 'easy'}
              onClick={() => setDifficulty('easy')}
              aria-label="Select Easy difficulty"
            >
              Easy
              <DifficultyLabel>Basic concepts</DifficultyLabel>
            </DifficultyOption>
            <DifficultyOption
              selected={difficulty === 'medium'}
              onClick={() => setDifficulty('medium')}
              aria-label="Select Medium difficulty"
            >
              Medium
              <DifficultyLabel>Moderate depth</DifficultyLabel>
            </DifficultyOption>
            <DifficultyOption
              selected={difficulty === 'hard'}
              onClick={() => setDifficulty('hard')}
              aria-label="Select Hard difficulty"
            >
              Hard
              <DifficultyLabel>Advanced level</DifficultyLabel>
            </DifficultyOption>
          </DifficultyContainer>
        </InputGroup>

        <StartButton
          onClick={generateQuiz}
          disabled={loading || !topic.trim()}
          aria-describedby={error ? "error-message" : undefined}
        >
          {loading && <LoadingSpinner />}
          {loading ? 'Generating Quiz...' : 'Start Quiz'}
        </StartButton>

        {error && (
          <ErrorMessage id="error-message" role="alert">
            {error}
          </ErrorMessage>
        )}

        <ExampleTopics>
          <ExampleTitle>Try these popular topics:</ExampleTitle>
          <ExampleList>
            {exampleTopics.map((exampleTopic, index) => (
              <ExampleTopic
                key={index}
                onClick={() => handleExampleClick(exampleTopic)}
                aria-label={`Use ${exampleTopic} as quiz topic`}
              >
                {exampleTopic}
              </ExampleTopic>
            ))}
          </ExampleList>
        </ExampleTopics>
      </ContentCard>
    </HomeContainer>
  );
};

export default Home;
