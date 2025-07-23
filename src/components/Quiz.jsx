import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const QuizContainer = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const QuizHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const TopicTitle = styled.h1`
  font-size: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 8px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ProgressText = styled.div`
  color: white;
  font-weight: 500;
  margin-top: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const QuestionCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const QuestionNumber = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const QuestionText = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button`
  background: ${props => {
    if (props.showFeedback) {
      if (props.isCorrect) return '#48bb78';
      if (props.isSelected && !props.isCorrect) return '#f56565';
    }
    return props.isSelected ? 'rgba(102, 126, 234, 0.1)' : 'white';
  }};
  color: ${props => props.showFeedback && (props.isCorrect || (props.isSelected && !props.isCorrect)) ? 'white' : '#333'};
  border: 2px solid ${props => {
    if (props.showFeedback) {
      if (props.isCorrect) return '#48bb78';
      if (props.isSelected && !props.isCorrect) return '#f56565';
    }
    return props.isSelected ? '#667eea' : '#e1e5e9';
  }};
  padding: 1rem 1.5rem;
  text-align: left;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover:not(:disabled) {
    background: ${props => props.showFeedback ? 
      (props.isCorrect ? '#48bb78' : props.isSelected && !props.isCorrect ? '#f56565' : 'rgba(102, 126, 234, 0.05)') 
      : 'rgba(102, 126, 234, 0.05)'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const OptionLetter = styled.span`
  font-weight: 600;
  margin-right: 1rem;
  color: ${props => props.showFeedback && (props.isCorrect || (props.isSelected && !props.isCorrect)) ? 'white' : '#667eea'};
`;

const FeedbackIcon = styled.span`
  font-size: 1.5rem;
  margin-left: 1rem;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NavButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  border: ${props => props.primary ? 'none' : '2px solid #667eea'};
  padding: 0.8rem 2rem;
  font-weight: 600;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubmitButton = styled(NavButton)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  font-size: 1.1rem;
  padding: 1rem 2.5rem;
`;

const Quiz = ({ questions, onSubmitQuiz, onBack, topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    if (showFeedback) return;
    
    const newAnswers = [...userAnswers];
    const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
    newAnswers[currentQuestion] = optionLetter;
    setUserAnswers(newAnswers);
    
    // Show feedback immediately
    setShowFeedback(true);
    
    // Auto-advance after showing feedback (except on last question)
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setShowFeedback(false);
        setCurrentQuestion(currentQuestion + 1);
      }, 2000);
    } else {
      // Mark quiz as completed when last question is answered
      setTimeout(() => {
        setQuizCompleted(true);
      }, 2000);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowFeedback(false);
    }
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    }
  };

  const handleSubmit = () => {
    onSubmitQuiz(userAnswers);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const selectedAnswer = userAnswers[currentQuestion];
  const selectedIndex = selectedAnswer ? ['A', 'B', 'C', 'D'].indexOf(selectedAnswer) : -1;

  return (
    <QuizContainer>
      <QuizHeader>
        <TopicTitle>{topic}</TopicTitle>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        <ProgressText>
          Question {currentQuestion + 1} of {questions.length}
        </ProgressText>
      </QuizHeader>

      <QuestionCard>
        <QuestionNumber>{currentQuestion + 1}</QuestionNumber>
        <QuestionText>{currentQ.question}</QuestionText>
        
        <OptionsContainer>
          {currentQ.options.map((option, index) => {
            const optionLetter = ['A', 'B', 'C', 'D'][index];
            const isSelected = selectedIndex === index;
            const isCorrect = currentQ.answer === optionLetter;
            
            return (
              <OptionButton
                key={index}
                onClick={() => handleAnswerSelect(index)}
                isSelected={isSelected}
                isCorrect={isCorrect}
                showFeedback={showFeedback}
                disabled={showFeedback}
                aria-label={`Option ${optionLetter}: ${option}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <OptionLetter 
                    isSelected={isSelected}
                    isCorrect={isCorrect}
                    showFeedback={showFeedback}
                  >
                    {optionLetter}.
                  </OptionLetter>
                  {option}
                </div>
                {showFeedback && isCorrect && (
                  <FeedbackIcon>✅</FeedbackIcon>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <FeedbackIcon>❌</FeedbackIcon>
                )}
              </OptionButton>
            );
          })}
        </OptionsContainer>
        
        {showFeedback && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '8px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <strong>Explanation:</strong> {currentQ.explanation}
          </div>
        )}
      </QuestionCard>

      <NavigationContainer>
        <NavButton onClick={onBack}>
          ← Back to Home
        </NavButton>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <NavButton
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </NavButton>
          
          {currentQuestion < questions.length - 1 && !showFeedback && (
            <NavButton
              onClick={goToNext}
              disabled={!selectedAnswer}
              primary
            >
              Next →
            </NavButton>
          )}
          
          {currentQuestion === questions.length - 1 && (
            <SubmitButton 
              onClick={handleSubmit}
              disabled={!selectedAnswer && !quizCompleted}
            >
              Submit Quiz 🎯
            </SubmitButton>
          )}
        </div>
      </NavigationContainer>
    </QuizContainer>
  );
};

export default Quiz;
