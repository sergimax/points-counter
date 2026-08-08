import './App.css'
import { AppFooter } from './components/app-footer'
import { AppHeader } from './components/app-header'
import { CurrentGameView } from './components/current-game-view'
import { GamesHistoryView } from './components/games-history-view'

function App() {

  return (
    <>
      <AppHeader />
      <div>
        <CurrentGameView />
      </div>
      <div>
        <GamesHistoryView />
      </div>
      <AppFooter />
    </>
  )
}

export default App
