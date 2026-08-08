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

export const RoundHistory = observer(function RoundHistory({
  game,
}: RoundHistoryProps) {
  const { t, locale } = useTranslation();
  const closedRounds = [...game.rounds].reverse();

  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
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
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>{t("game.round")}</TableCell>
                {game.players.map((player) => {
                  const color = getColorTokens(player.colorId);
                  return (
                  <TableCell
                    key={player.id}
                    align="right"
                    sx={{ fontWeight: 600 }}
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
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t("game.roundNumber", { number: round.number })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("game.roundStarted", {
                        date: formatDateTime(round.startedAt, locale),
                      })}
                    </Typography>
                  </TableCell>
                  {game.players.map((player) => (
                    <TableCell
                      key={player.id}
                      align="right"
                      sx={{ fontFamily: "var(--font-mono)" }}
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
