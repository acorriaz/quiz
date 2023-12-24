import './App.css'
import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import {decode} from "html-entities";
import LandingPage from "./components/LandingPage.jsx";
import Quiz from "./components/Quiz.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("landing")
  const [quizData, setQuizData] = useState([])
  const [userSelected, setUserSelected] = useState({})
  const [isChecked, setIsChecked] = useState(false)
  const [totalScore, setTotalScore] = useState("")
  // TODO: state to check total score


  // Fetch quizData
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=15&difficulty=medium&type=multiple')
      const data = await res.json()

      const newData = data.results.map((quiz) => {
        const { question } = quiz
        const answers = [...quiz.incorrect_answers, quiz.correct_answer,]

        // Add isHeld to each answers
        const answersWithHeld = answers.map((answer) => {
          return {
            text: decode(answer),
            isHeld: false
          }
        })

        // Shuffle answers
        answersWithHeld.sort(() => Math.random() - 0.5)

        return {
          ...quiz,
          allAnswers: answersWithHeld,
          question: decode(question)
        }
      })

      setQuizData(newData)
    }

    fetchData()
  }, [])

  function changePage(page) {
    setCurrentPage(page)
  }

  function updateScore() {
    setTotalScore(() => {
      let score = 0
      for (let quiz of quizData) {
        if (userSelected[quiz.question] === quiz.correct_answer) {
          score++
        }
      }
      return score
    })
  }

  function handleClick(questionOfAns, choice)  {
    // change isHeld value
    setQuizData((prevQuiz) => {
      return prevQuiz.map((quizQuestion) => {
        // find correct choice and flip value
        if (questionOfAns === quizQuestion.question) {
          const updatedIsHeldAns = quizQuestion.allAnswers.map((answer) => (
            answer.text === choice ? {
                ...answer,
                isHeld: !answer.isHeld
            } : {
              ...answer,
              isHeld: false
            }
          ))
          return {
            ...quizQuestion,
            allAnswers: updatedIsHeldAns
          }
        } else {
          return quizQuestion
        }
      })
    })

    setUserSelected((prevSelected) => ({...prevSelected, [questionOfAns]: choice}))
  }

  function handleCheck() {
    setIsChecked((prevState) => !prevState)
    updateScore()
  }

  const quizComponents = quizData.map((quiz) => (
    <Quiz
      key={nanoid()}
      question={quiz.question}
      answers={quiz.allAnswers}
      correctAns={quiz.correct_answer}
      isCorrect={userSelected[quiz.question] === quiz.correct_answer}
      isChecked={isChecked}
      handleClick={handleClick}
    />))

  return (
    <>
      {
        currentPage === "landing" &&
        <LandingPage
          changePage={changePage}
        />
      }
      {
        currentPage === "quiz" &&
        <>
          {quizComponents}
          {isChecked && <p className="quiz--checked_text">You scored {totalScore}/5 correct answers</p>}
          <button onClick={handleCheck}>Check Answer</button>
          {
            isChecked
            ? <button>Play Again</button>
            : <button onClick={() => changePage("landing")}>Back</button>
          }
        </>
      }
    </>
  )
}

export default App
