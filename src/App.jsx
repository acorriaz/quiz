import './App.css'
import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import {decode} from "html-entities";
import LandingPage from "./components/LandingPage.jsx";
import Quiz from "./components/Quiz.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("landing")
  const [quizData, setQuizData] = useState([])

  console.log(quizData)

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

  function handleHeld(questionOfAns, choice)  {
    console.log("choice", choice)
    console.log("question", questionOfAns)
    setQuizData((prevQuiz) => {
      return prevQuiz.map((quizQuestion) => {
        // find correct choice and flip value
        if (questionOfAns === quizQuestion.question) {
          const updatedIsHeldAns = quizQuestion.allAnswers.map((answer) => (
            answer.text === choice ? {
                ...answer,
                isHeld: !answer.isHeld
            } :
              answer
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
  }

  const quizComponents = quizData.map((quiz) => (
    <Quiz
      key={nanoid()}
      question={quiz.question}
      answers={quiz.allAnswers}
      handleHeld={handleHeld}
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
          <button onClick={() => changePage("landing")}>Back</button>
        </>
      }
    </>
  )
}

export default App
