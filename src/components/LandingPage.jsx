export default function LandingPage(props) {
  return (
    <div className="landing">
      <h1 className="landing--header">Quizzical</h1>
      <p className="landing--text">Some description</p>
      <button onClick={() => props.changePage("quiz")}>Start quiz</button>
    </div>
  )
}