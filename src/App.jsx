import './App.css'
import {useState} from "react";
import LandingPage from "./components/LandingPage.jsx";
import Quiz from "./components/Quiz.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("landing")

  function changePage(page) {
    setCurrentPage(page)
  }

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
          <Quiz />
          <button onClick={() => changePage("landing")}>Back</button>
        </>
      }
    </>
  )
}

export default App
