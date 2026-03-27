const virtualImages: Record<string, any> = {
  "10159": require("../assets/virtuals/10159.png"),
  "10163": require("../assets/virtuals/10163.png"),
  "10174": require("../assets/virtuals/10174.png"),
  "10175": require("../assets/virtuals/10175.png"),
  "10177": require("../assets/virtuals/10177.png"),
  "10179": require("../assets/virtuals/10179.png"),
  "10185": require("../assets/virtuals/10185.png"),
  "10186": require("../assets/virtuals/10186.png"),
  "10187": require("../assets/virtuals/10187.png"),
  "10191": require("../assets/virtuals/10191.png"),
  "10203": require("../assets/virtuals/10203.png"),
  "10206": require("../assets/virtuals/10206.png"),
  "10282": require("../assets/virtuals/10282.png"),
  "10402": require("../assets/virtuals/10402.png"),
  "10403": require("../assets/virtuals/10403.png"),
};

const BG_FIELD = require("../assets/virtuals/bg_field.png");
const BG_DARTS = require("../assets/virtuals/bg_darts.png");

const virtualBackgrounds: Record<string, any> = {
  "10185": BG_FIELD,
  "10163": BG_FIELD,
  "10402": BG_FIELD,
  "10186": BG_FIELD,
  "10187": BG_FIELD,
  "10403": BG_FIELD,
  "10159": BG_DARTS,
  "10177": "#BE3034",
  "10191": "#BE3034",
  "10179": "#F4D34A",
  "10282": "#F4D34A",
  "10203": "#5C2C15",
  "10206": "#5C2C15",
  "10174": "#CCC8D5",
  "10175": "#CCC8D5",
};

export function getVirtualImage(iconId: string): any {
  return virtualImages[iconId];
}

export function getVirtualBackground(iconId: string): any {
  return virtualBackgrounds[iconId];
}
