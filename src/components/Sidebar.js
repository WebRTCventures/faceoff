export default function Sidebar({currentWinner}) {
  return (
    <div className="sidebar">
      <div className="title">Scorecard</div>

      <div className="number-card">
        <div className="title">Games played</div>
        <div className="detail">0</div>
      </div>
      <div className="number-card">
        <div className="title">Current winner</div>
        <div className="detail">{currentWinner}</div>
      </div>
    </div>
  )
}