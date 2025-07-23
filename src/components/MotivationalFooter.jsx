import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: ${slideUp} 0.6s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FooterIcon = styled.span`
  font-size: 1.5rem;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
`;

const FooterText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MotivationalFooter = () => {
  const motivationalMessages = [
    { icon: '🌟', text: 'Learning something new every day!' },
    { icon: '🚀', text: 'Keep challenging yourself!' },
    { icon: '🧠', text: 'Your brain is your greatest asset!' },
    { icon: '💡', text: 'Every question makes you smarter!' },
    { icon: '🎯', text: 'Practice makes progress!' },
    { icon: '📚', text: 'Knowledge is the key to success!' },
    { icon: '⭐', text: 'Believe in your potential!' },
    { icon: '🔥', text: 'Stay curious, stay growing!' },
    { icon: '💪', text: 'Challenge accepted, challenge conquered!' },
    { icon: '🌈', text: 'Every mistake is a learning opportunity!' },
    { icon: '🏆', text: 'You\'re doing great, keep it up!' },
    { icon: '🎉', text: 'Celebrate small wins!' },
    { icon: '✨', text: 'Education is the most powerful weapon!' },
    { icon: '🎭', text: 'Learning is a lifelong adventure!' },
    { icon: '🌱', text: 'Growth happens outside your comfort zone!' },
    { icon: '🎪', text: 'Make learning fun and exciting!' },
    { icon: '🌊', text: 'Dive deep into the ocean of knowledge!' },
    { icon: '🗝️', text: 'Curiosity opens all doors!' },
    { icon: '🎨', text: 'Paint your mind with colorful knowledge!' },
    { icon: '⚡', text: 'Spark your intellectual potential!' }
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length);
      setKey(prev => prev + 1); // Force re-animation
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, [motivationalMessages.length]);

  return (
    <FooterContainer>
      <FooterContent key={key}>
        <FooterIcon>
          {motivationalMessages[currentMessage].icon}
        </FooterIcon>
        <FooterText>
          {motivationalMessages[currentMessage].text}
        </FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default MotivationalFooter;
