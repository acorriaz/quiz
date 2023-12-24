import {nanoid} from "nanoid";

export default function Quiz(props) {

  const calculateClassName = (answer) => {
    if (!props.isChecked) {
      return `btn ${answer.isHeld ? "btn--selected" : ""}`
    }

    if (props.isCorrect) {

      return `btn ${answer.isHeld ? "btn--checked_selected" : ""}`
    } else if (!props.isCorrect) {
      return `btn 
      ${answer.isHeld ? "btn--checked_selected" : ""} 
      ${answer.text === props.correctAns ? "btn--checked_correct_ans" : ""}`
    }
  }

  const answersElement = props.answers.map((answer) => (
    <button
      key={nanoid()}
      className={calculateClassName(answer)}
      onClick={() => props.handleClick(props.question, answer.text)}
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