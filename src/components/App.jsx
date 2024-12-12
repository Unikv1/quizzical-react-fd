import { useState, useEffect } from 'react'
import '../css/App.css'
import { encode, decode } from 'html-entities';
import Question from './Question.jsx'
import background1 from '../assets/background_shape_1.png'
import background2 from '../assets/background_shape_2.png'
import { nanoid } from 'nanoid'

function App() {
  const [questions, setQuestions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(false);
  const [formData, setFormData] = useState(questions.reduce((acc, question) => {
    acc[question.id] = '';
    return acc;
  }, {}));
  const handleAnswerChange = (questionId, answer) => {
    setFormData(prevData => ({
      ...prevData,
      [questionId]: answer
    }));
  };

  const toggleClick = (questionId, answerId) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.map(answer => ({
              ...answer,
              clicked: answer.text === answerId ? !answer.clicked : false
            }))
          };
        }
        return question;
      })
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const count = questions.reduce((total, question) => {
      return total + question.answers.filter(answer => answer.clicked && answer.isCorrect).length;
    }, 0);
  
    setCorrectCount(count);
    setCheckAnswers(true);
  };
  const [checkAnswers, setCheckAnswers] = useState(false);



  useEffect(() => {
    if(start) {
      fetch('https://opentdb.com/api.php?amount=5')
        .then(response => response.json())
        .then(questionsObject => {
          const processedQuestions = questionsObject.results.map(result => {
            // Combine correct and incorrect answers
            const allAnswers = [
              ...result.incorrect_answers,
              result.correct_answer
            ];
  
            // Shuffle the answers
            const shuffledAnswers = allAnswers
              .sort(() => Math.random() - 0.5)
              .map(answer => ({
                text: answer,
                isCorrect: answer === result.correct_answer,
                clicked: false
              }));
  
            return {
              id: nanoid(),
              question: result.question,
              answers: shuffledAnswers
            };
          });
  
          setQuestions(processedQuestions);
        })
        .catch(error => console.error('Error fetching questions:', error));
    }
  }, [start]);

  useEffect(() => {
    if(start) {
      fetch('https://opentdb.com/api.php?amount=5')
        .then(response => response.json())
        .then(questionsObject => {
          const processedQuestions = questionsObject.results.map(result => {
            // Combine correct and incorrect answers
            const allAnswers = [
              ...result.incorrect_answers,
              result.correct_answer
            ];
  
            // Shuffle the answers
            const shuffledAnswers = allAnswers
              .sort(() => Math.random() - 0.5)
              .map(answer => ({
                text: answer,
                isCorrect: answer === result.correct_answer,
                clicked: false
              }));
  
            return {
              id: nanoid(),
              question: result.question,
              answers: shuffledAnswers
            };
          });
  
          setQuestions(processedQuestions);
          setCorrectCount(0);
          setReset(false);
          setCheckAnswers(false);
        })
        .catch(error => console.error('Error fetching questions:', error));
    }
  }, [reset]);

  console.log(reset)

  const questionElements = questions.map( question => (
      <Question
        key={question.id}
        questionObject={question}
        selectedAnswer={formData[question.id]}
        onAnswerChange={handleAnswerChange}
        checkAnswers={checkAnswers}
        toggleClick={toggleClick}
      />
    ))

  return (
    <div className='quizzical'>
      <img className='quizzical--background1' src={background1}></img>
      <img className='quizzical--background2' src={background2}></img>
      {!start && (
        <>
          <h1 className='quizzical--title'> Quizzical </h1>
          <h2 className='quizzical--description'> Some description if needed</h2>
          <button className='quizzical--button' onClick={() => setStart(true)}> Start quiz</button>
        </>
      )} 
      {start && (
        <form onSubmit={handleSubmit}>
          {questionElements}
          <button type="submit" className='quizzical--button margin-top check'> Check Answers </button>
        </form>
      )}
      {checkAnswers && (
        <h1 className='margin-top'> {`You answered ${correctCount}/5 correctly.`} </h1>
      )}
      {checkAnswers && (
        <button className='quizzical--button' onClick={() => setReset(true)}> Try Again </button>
      )}

    </div>
  )
}

export default App
