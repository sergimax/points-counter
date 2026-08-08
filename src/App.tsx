import { useState } from "react";
import "./App.css";
import { AppHeader } from "./components/app-header";
import {
  AppToolbarActions,
  type ToolbarPanelId,
} from "./components/app-toolbar-actions";
import { CurrentGameView } from "./components/current-game-view";
import { GamesPanel } from "./components/games-panel";
import { NewGameDialog } from "./components/new-game-dialog";

function App() {
  const [openPanel, setOpenPanel] = useState<ToolbarPanelId>(null);
  const [newGameOpen, setNewGameOpen] = useState(false);

  return (
    <div className="app-shell">
      <AppHeader
        center={
          <AppToolbarActions
            openPanel={openPanel}
            onToggleGames={() =>
              setOpenPanel((previous) => (previous === "games" ? null : "games"))
            }
            onOpenNewGame={() => {
              setOpenPanel(null);
              setNewGameOpen(true);
            }}
          />
        }
      />
      <main className="app-main">
        <GamesPanel
          open={openPanel === "games"}
          onClose={() => setOpenPanel(null)}
        />
        <CurrentGameView />
      </main>
      <NewGameDialog
        open={newGameOpen}
        onClose={() => setNewGameOpen(false)}
      />
    </div>
  );
}

export default App;
