export const getCasinoImage = (id: string | number) =>
  `https://static.sportingtech.com/common/assets/images/casino/300x200/${id}.jpg`;

export const getLiveCasinoImage = (id: string | number) =>
  `https://static.sportingtech.com/m-common/assets/images/livecasino/300x200/${id}.jpg`;

export const getIframeImage = (id: string | number) =>
  `https://static.sportingtech.com/common/assets/images/virtuals/virtual-${id}.jpg`;

export const getTeamImage = (competitorExternalId: string | number) =>
  `https://img-cdn001.akamaized.net/ls/crest/medium/${competitorExternalId}.png`;
