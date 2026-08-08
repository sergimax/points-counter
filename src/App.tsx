import "./App.css";
import { AppFooter } from "./components/app-footer";
import { AppHeader } from "./components/app-header";
import { CurrentGameView } from "./components/current-game-view";
import { GamesHistoryView } from "./components/games-history-view";

function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <CurrentGameView />
        <GamesHistoryView />
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
