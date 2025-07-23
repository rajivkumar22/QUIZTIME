import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const confettiAnimation = keyframes`
  0% { 
    transform: rotateZ(0deg) translateY(0px) rotateX(0deg); 
    opacity: 1; 
  }
  100% { 
    transform: rotateZ(720deg) translateY(-1000px) rotateX(180deg); 
    opacity: 0; 
  }
`;

const starburstAnimation = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

const celebrationPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fireworkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  15% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const ResultsContainer = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const ScoreCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${props => props.celebrating ? 
    `fadeIn 0.8s ease-out, ${celebrationPulse} 0.8s ease-in-out 0.5s` : 
    'fadeIn 0.8s ease-out'};
  position: relative;
  overflow: hidden;
  
  ${props => props.celebrating && `
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3), 0 0 0 3px rgba(102, 126, 234, 0.1);
  `}
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const ScoreEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-in-out;
`;

const ScoreTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ScoreSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const ScoreDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ScorePercentage = styled.div`
  font-size: 1.5rem;
  color: ${props => {
    if (props.percentage >= 80) return '#48bb78';
    if (props.percentage >= 60) return '#ed8936';
    return '#f56565';
  }};
  font-weight: 600;
  margin-bottom: 2rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'white'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  border: ${props => props.primary ? 'none' : '2px solid #667eea'};
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DetailedResults = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.8s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    margin: 1rem;
  }
`;

const ResultsTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const QuestionResult = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const QuestionNumber = styled.div`
  background: ${props => props.isCorrect ? '#48bb78' : '#f56565'};
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const ResultIcon = styled.span`
  font-size: 1.5rem;
  margin-left: auto;
`;

const QuestionText = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  flex: 1;
`;

const AnswerComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnswerBox = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.isCorrect ? 
    'rgba(72, 187, 120, 0.1)' : 
    'rgba(245, 101, 101, 0.1)'};
  border: 1px solid ${props => props.isCorrect ? 
    'rgba(72, 187, 120, 0.3)' : 
    'rgba(245, 101, 101, 0.3)'};
`;

const AnswerLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.isCorrect ? '#2f855a' : '#c53030'};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AnswerText = styled.div`
  color: #333;
  font-weight: 500;
`;

const Explanation = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-left: 4px solid #667eea;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
  color: #333;
  line-height: 1.6;
`;

const ConfettiPiece = styled.div`
  position: absolute;
  width: ${props => props.size || 10}px;
  height: ${props => props.size || 10}px;
  background: ${props => props.color};
  animation: ${confettiAnimation} ${props => props.duration || 3}s linear infinite;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}%;
  top: -20px;
  border-radius: ${props => props.shape === 'circle' ? '50%' : props.shape === 'star' ? '0' : '2px'};
  
  ${props => props.shape === 'star' && `
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  `}
  
  ${props => props.shape === 'triangle' && `
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  `}
`;

const StarburstElement = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  animation: ${starburstAnimation} 1.5s ease-out infinite;
  animation-delay: ${props => props.delay}s;
  
  &::before {
    content: '✨';
    font-size: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const FireworkElement = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  
  &::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border: 2px solid ${props => props.color};
    border-radius: 50%;
    top: -50px;
    left: -50px;
    animation: ${fireworkAnimation} 1s ease-out infinite;
    animation-delay: ${props => props.delay}s;
  }
`;

const CelebrationOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 24px;
`;

const Results = ({ questions, userAnswers, onRetakeQuiz, onNewQuiz, topic }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStarburst, setShowStarburst] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  
  const correctAnswers = userAnswers.filter((answer, index) => 
    answer === questions[index].answer
  ).length;
  
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  
  useEffect(() => {
    // Determine celebration type based on score
    if (percentage >= 90) {
      // Outstanding score - full celebration with fireworks
      setCelebrating(true);
      setShowConfetti(true);
      setShowStarburst(true);
      setShowFireworks(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setShowStarburst(false);
        setShowFireworks(false);
        setCelebrating(false);
      }, 4000);
    } else if (percentage >= 80) {
      // Great score - confetti and starburst
      setCelebrating(true);
      setShowConfetti(true);
      setShowStarburst(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setShowStarburst(false);
        setCelebrating(false);
      }, 3500);
    } else if (percentage >= 70) {
      // Good score - just confetti
      setCelebrating(true);
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setCelebrating(false);
      }, 3000);
    }
  }, [percentage]);

  const getScoreEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '😊';
    if (percentage >= 60) return '😐';
    return '😔';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Well done!';
    if (percentage >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <ResultsContainer>
      <ScoreCard celebrating={celebrating}>
        <CelebrationOverlay>
          {/* Enhanced Confetti */}
          {showConfetti && (
            <>
              {[...Array(80)].map((_, i) => {
                const shapes = ['circle', 'square', 'star', 'triangle'];
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#ffd93d'];
                return (
                  <ConfettiPiece
                    key={`confetti-${i}`}
                    color={colors[i % colors.length]}
                    shape={shapes[i % shapes.length]}
                    size={Math.random() * 12 + 6}
                    delay={Math.random() * 3}
                    duration={Math.random() * 2 + 2}
                    left={Math.random() * 100}
                  />
                );
              })}
            </>
          )}
          
          {/* Starburst Elements */}
          {showStarburst && (
            <>
              {[...Array(12)].map((_, i) => (
                <StarburstElement
                  key={`star-${i}`}
                  left={Math.random() * 100}
                  top={Math.random() * 100}
                  delay={Math.random() * 2}
                />
              ))}
            </>
          )}
          
          {/* Firework Elements */}
          {showFireworks && (
            <>
              {[...Array(6)].map((_, i) => (
                <FireworkElement
                  key={`firework-${i}`}
                  color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#a8e6cf'][i % 6]}
                  left={20 + (Math.random() * 60)}
                  top={20 + (Math.random() * 60)}
                  delay={i * 0.3}
                />
              ))}
            </>
          )}
        </CelebrationOverlay>
        
        <ScoreEmoji>{getScoreEmoji()}</ScoreEmoji>
        <ScoreTitle>{getScoreMessage()}</ScoreTitle>
        <ScoreSubtitle>Your quiz on "{topic}" is complete!</ScoreSubtitle>
        
        <ScoreDisplay>
          {correctAnswers} / {questions.length}
        </ScoreDisplay>
        
        <ScorePercentage percentage={percentage}>
          {percentage}% Correct
        </ScorePercentage>
        
        <ActionsContainer>
          <ActionButton onClick={onRetakeQuiz}>
            🔄 Retake Quiz
          </ActionButton>
          <ActionButton onClick={onNewQuiz} primary>
            ✨ New Quiz Topic
          </ActionButton>
        </ActionsContainer>
      </ScoreCard>

      <DetailedResults>
        <ResultsTitle>Detailed Results</ResultsTitle>
        
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.answer;
          const userAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(userAnswer);
          const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(question.answer);
          
          return (
            <QuestionResult key={index}>
              <QuestionHeader>
                <QuestionNumber isCorrect={isCorrect}>
                  {index + 1}
                </QuestionNumber>
                <QuestionText>{question.question}</QuestionText>
                <ResultIcon>{isCorrect ? '✅' : '❌'}</ResultIcon>
              </QuestionHeader>
              
              <AnswerComparison>
                <AnswerBox isCorrect={false}>
                  <AnswerLabel isCorrect={false}>Your Answer</AnswerLabel>
                  <AnswerText>
                    {userAnswer ? `${userAnswer}. ${question.options[userAnswerIndex]}` : 'No answer selected'}
                  </AnswerText>
                </AnswerBox>
                
                <AnswerBox isCorrect={true}>
                  <AnswerLabel isCorrect={true}>Correct Answer</AnswerLabel>
                  <AnswerText>
                    {question.answer}. {question.options[correctAnswerIndex]}
                  </AnswerText>
                </AnswerBox>
              </AnswerComparison>
              
              <Explanation>
                <strong>Explanation:</strong> {question.explanation}
              </Explanation>
            </QuestionResult>
          );
        })}
      </DetailedResults>
    </ResultsContainer>
  );
};

export default Results;
