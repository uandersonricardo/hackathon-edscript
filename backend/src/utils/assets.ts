import teams from "../assets/json/bets-api/teams.json";

export const competitorToBetsApiTeam = (competitorExternalId: string) => {
  (teams as Record<string, any>[]).find((team) => team.image_id === competitorExternalId);
};
