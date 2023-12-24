import {nanoid} from "nanoid";

export default function Quiz(props) {
  const answersElement = props.answers.map((answer) => (
    <button
      key={nanoid()}
      // TODO: click to update quizData state and add to userSelected state
      className={`btn ${answer.isHeld ? "btn-selected" : ""}`}
      onClick={() => props.handleHeld(props.question, answer.text)}
    >
      {answer.text}
    </button>
  ))

  return (
    <div>
      <h2>{props.question}</h2>
      {answersElement}
    </div>
  )
}