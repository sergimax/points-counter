// import { useObserver } from "mobx-react";
import { observer } from "mobx-react";
import { Game } from "../../state";

const AppHeaderView = observer(({ game }: { game: Game }) => {
    return (
        <>
            {game.getCurrentTitle}
            <button onClick={() => game.toggleStatus()}>Change Status</button>
        </>
    )
});

export const AppHeader = () => {
    const game = new Game("Game 1");

    return <>
        <header>
            <AppHeaderView game={game} />
        </header>
    </>
}
