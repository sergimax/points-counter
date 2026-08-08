import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import "./App.css";
import { AppHeader } from "./components/app-header";
import { AppToolbarActions } from "./components/app-toolbar-actions";
import { CurrentGameView } from "./components/current-game-view";
import { GamesView } from "./components/games-view";
import { InstallPrompt } from "./components/install-prompt";
import { NewGameView } from "./components/new-game-view";
import { OfflineBanner } from "./components/offline-banner";
import { useRootStore } from "./stores/use-root-store.ts";
import type { AppViewId } from "./types/app-view.ts";

const App = observer(function App() {
  const rootStore = useRootStore();
  const hasActiveGame = Boolean(rootStore.activeGame);
  const [activeView, setActiveView] = useState<AppViewId>(() =>
    rootStore.activeGame ? "current" : "games",
  );

  // No active game → Games list (empty first visit, or after deleting the active game).
  useEffect(() => {
    if (!hasActiveGame && activeView === "current") {
      setActiveView("games");
    }
  }, [hasActiveGame, activeView]);

  function changeView(view: AppViewId): void {
    if (view === "current" && !rootStore.activeGame) {
      setActiveView("games");
      return;
    }
    setActiveView(view);
  }

  return (
    <div className="app-shell">
      <AppHeader
        center={
          <AppToolbarActions
            activeView={activeView}
            onChangeView={changeView}
            hasActiveGame={hasActiveGame}
          />
        }
      />
      <OfflineBanner />
      <main className="app-main">
        {activeView === "current" ? <CurrentGameView /> : null}
        {activeView === "games" ? (
          <GamesView
            onActivated={() => setActiveView("current")}
            onNewGame={() => setActiveView("new")}
          />
        ) : null}
        {activeView === "new" ? (
          <NewGameView onCreated={() => setActiveView("current")} />
        ) : null}
      </main>
      <InstallPrompt />
    </div>
  );
});

export default App;
