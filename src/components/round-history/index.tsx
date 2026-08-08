import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useTranslation } from "../../i18n/use-translation.ts";
import { formatDateTime } from "../../lib/format-date.ts";
import { getColorTokens } from "../../lib/player-colors.ts";
import type { GameModel } from "../../stores/game-model.ts";

type RoundHistoryProps = {
  game: GameModel;
};

/** Fixed width for the sticky “Round” column while player scores scroll horizontally. */
const ROUND_COLUMN_WIDTH_PX = 148;

const stickyRoundCellSx = {
  position: "sticky",
  left: 0,
  width: ROUND_COLUMN_WIDTH_PX,
  minWidth: ROUND_COLUMN_WIDTH_PX,
  maxWidth: ROUND_COLUMN_WIDTH_PX,
  bgcolor: "background.paper",
  boxShadow: "4px 0 8px -4px rgba(0, 0, 0, 0.18)",
} as const;

export const RoundHistory = observer(function RoundHistory({
  game,
}: RoundHistoryProps) {
  const { t, locale } = useTranslation();
  const closedRounds = [...game.rounds].reverse();

  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, width: "100%" }}>
      <Typography
        variant="subtitle1"
        sx={{ fontFamily: "var(--font-display)", mb: 1.25 }}
      >
        {t("game.historyTitle")}
      </Typography>

      {closedRounds.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          {t("game.historyEmpty")}
        </Typography>
      ) : (
        <TableContainer
          sx={{
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
            maxHeight: 360,
            overflowX: "auto",
          }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: "max-content" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    ...stickyRoundCellSx,
                    zIndex: 3,
                    fontWeight: 600,
                    // Stay above horizontally scrolled cells and the vertical sticky header.
                    top: 0,
                  }}
                >
                  {t("game.round")}
                </TableCell>
                {game.players.map((player) => {
                  const color = getColorTokens(player.colorId);
                  return (
                    <TableCell
                      key={player.id}
                      align="right"
                      sx={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        minWidth: 88,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          maxWidth: 108,
                          verticalAlign: "bottom",
                        }}
                        title={player.name}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: color.main,
                            flexShrink: 0,
                          }}
                        />
                        <Box
                          component="span"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {player.name}
                        </Box>
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {closedRounds.map((round) => (
                <TableRow key={round.id}>
                  <TableCell
                    sx={{
                      ...stickyRoundCellSx,
                      zIndex: 1,
                      verticalAlign: "top",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t("game.roundNumber", { number: round.number })}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", whiteSpace: "normal" }}
                    >
                      {t("game.roundStarted", {
                        date: formatDateTime(round.startedAt, locale),
                      })}
                    </Typography>
                  </TableCell>
                  {game.players.map((player) => (
                    <TableCell
                      key={player.id}
                      align="right"
                      sx={{
                        fontFamily: "var(--font-mono)",
                        whiteSpace: "nowrap",
                        minWidth: 88,
                      }}
                    >
                      {round.scores[player.id] ?? 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
});
