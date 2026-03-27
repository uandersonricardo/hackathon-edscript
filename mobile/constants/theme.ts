/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#FFFFFF",
    textMuted: "#9A99AC",
    inputBackground: "#282655",
    background: "#07042E",
    primary: "#3AE77E",
    secondary: "#E7E13A",
    tertiary: "#0B18DE",
    primaryMuted: "#174B49",
    primaryLight: "#AAFFCB",
    tertiaryStroke: "#707BE8",
    card: "#02001A",
    diamond: "#A630EB",
  },
  dark: {
    text: "#FFFFFF",
    textMuted: "#9A99AC",
    inputBackground: "#282655",
    background: "#07042E",
    primary: "#3AE77E",
    secondary: "#E7E13A",
    tertiary: "#0B18DE",
    primaryMuted: "#174B49",
    primaryLight: "#AAFFCB",
    tertiaryStroke: "#707BE8",
    card: "#02001A",
    diamond: "#A630EB",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
