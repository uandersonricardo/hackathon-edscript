import * as React from "react";
import { Platform } from "react-native";
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  RadialGradient,
  Stop,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
} from "react-native-svg";

const TopWinRightShape = (props: SvgProps) => (
  <Svg viewBox="0 0 304 109" fill="none" {...props}>
    <G filter="url(#a)" shapeRendering="crispEdges">
      <Path
        fill="url(#b)"
        d="M277.704 98H25.531c-2.255 0-3.703-2.395-2.657-4.392l1.387-2.647a38 38 0 0 0 2.303-29.91l-15.9-46.582a3 3 0 0 1 2.839-3.969h264.201c8.284 0 15 6.716 15 15V83c0 8.284-6.716 15-15 15Z"
      />
      <Path
        stroke="#3AE77E"
        d="M277.704 98H25.531c-2.255 0-3.703-2.395-2.657-4.392l1.387-2.647a38 38 0 0 0 2.303-29.91l-15.9-46.582a3 3 0 0 1 2.839-3.969h264.201c8.284 0 15 6.716 15 15V83c0 8.284-6.716 15-15 15Z"
      />
    </G>
    <Defs>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(121.857 168.5 -499.862 38.4973 -48.036 142.5)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.288} stopColor="#3AE77E" />
        <Stop offset={1} stopColor="#04065B" stopOpacity={0} />
      </RadialGradient>
      <Filter id="a" width={303.204} height={108.5} x={0} y={0} filterUnits="userSpaceOnUse">
        <FeFlood floodOpacity={0} result="BackgroundImageFix" />
        <FeColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <FeOffset />
        {Platform.OS === "ios" ? (
          <>
            <FeGaussianBlur stdDeviation={3} />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix values="0 0 0 0 0.042311 0 0 0 0 0.799103 0 0 0 0 0.208637 0 0 0 1 0" />
            <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow_218_38" />
            <FeBlend in="SourceGraphic" in2="effect1_dropShadow_218_38" result="shape" />
          </>
        ) : (
          <>
            <FeGaussianBlur stdDeviation={5} />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix values="0 0 0 0 0.227451 0 0 0 0 0.905882 0 0 0 0 0.494118 0 0 0 1 0" />
            <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow_218_38" />
            <FeBlend in="SourceGraphic" in2="effect1_dropShadow_218_38" result="shape" />
          </>
        )}
        <FeGaussianBlur stdDeviation={5} />
        <FeComposite in2="hardAlpha" operator="out" />
        <FeColorMatrix values="0 0 0 0 0.227451 0 0 0 0 0.905882 0 0 0 0 0.494118 0 0 0 1 0" />
        <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow_218_38" />
        <FeBlend in="SourceGraphic" in2="effect1_dropShadow_218_38" result="shape" />
      </Filter>
    </Defs>
  </Svg>
);

export default TopWinRightShape;
