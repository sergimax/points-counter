import { useState } from "react";
import "./App.css";
import { AppHeader } from "./components/app-header";
import { AppToolbarActions } from "./components/app-toolbar-actions";
import { CurrentGameView } from "./components/current-game-view";
import { GamesView } from "./components/games-view";
import { NewGameView } from "./components/new-game-view";
import type { AppViewId } from "./types/app-view.ts";

function App() {
  const [activeView, setActiveView] = useState<AppViewId>("current");

  return (
    <div className="app-shell">
      <AppHeader
        center={
          <AppToolbarActions
            activeView={activeView}
            onChangeView={setActiveView}
          />
        }
      />
      <main className="app-main">
        {activeView === "current" ? <CurrentGameView /> : null}
        {activeView === "games" ? (
          <GamesView onActivated={() => setActiveView("current")} />
        ) : null}
        {activeView === "new" ? (
          <NewGameView onCreated={() => setActiveView("current")} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
