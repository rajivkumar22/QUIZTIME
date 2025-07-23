import React, { useState } from 'react';
import styled from 'styled-components';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Navbar from './components/Navbar';
import MotivationalFooter from './components/MotivationalFooter';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'quiz', 'results'
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizTopic, setQuizTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState('medium');

  const startQuiz = (topic, count, questions, difficulty = 'medium') => {
    setQuizTopic(topic);
    setQuestionCount(count);
    setQuizDifficulty(difficulty);
    setQuizData(questions);
    setUserAnswers(new Array(questions.length).fill(null));
    setCurrentView('quiz');
  };

  const submitQuiz = (answers) => {
    setUserAnswers(answers);
    setCurrentView('results');
  };

  const resetQuiz = () => {
    setCurrentView('home');
    setQuizData(null);
    setUserAnswers([]);
    setQuizTopic('');
    setQuestionCount(5);
    setQuizDifficulty('medium');
  };

  const retakeQuiz = () => {
    setUserAnswers(new Array(quizData.length).fill(null));
    setCurrentView('quiz');
  };

  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        {currentView === 'home' && (
          <Home onStartQuiz={startQuiz} />
        )}
        {currentView === 'quiz' && (
          <Quiz 
            questions={quizData}
            onSubmitQuiz={submitQuiz}
            onBack={resetQuiz}
            topic={quizTopic}
          />
        )}
        {currentView === 'results' && (
          <Results 
            questions={quizData}
            userAnswers={userAnswers}
            onRetakeQuiz={retakeQuiz}
            onNewQuiz={resetQuiz}
            topic={quizTopic}
          />
        )}
      </MainContent>
      <MotivationalFooter />
    </AppContainer>
  );
}

export default App;
