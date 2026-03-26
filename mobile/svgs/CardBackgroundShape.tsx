import React from "react";
import Svg, { SvgProps, G, Mask, Path, Defs, LinearGradient, Stop, ClipPath } from "react-native-svg";

const CardBackgroundShape = (props: SvgProps) => (
  <Svg {...props} viewBox="0 0 77 88" fill="none">
    <G clipPath="url(#a)" opacity={0.25}>
      <G opacity={0.5}>
        <Mask
          id="b"
          width={77}
          height={94}
          x={-2}
          y={-5}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <Path fill="#fff" d="M74.707 88.325V-4.221H-1.407v92.546h76.114Z" />
        </Mask>
        <G mask="url(#b)">
          <Mask
            id="c"
            width={77}
            height={94}
            x={-2}
            y={-5}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <Path fill="#fff" d="M74.707 88.325V-4.221H-1.407v92.546h76.114Z" />
          </Mask>
          <G mask="url(#c)">
            <Path
              fill="url(#d)"
              fillRule="evenodd"
              d="M43.946 70.289c-8.755-2.953-15.111-11.118-15.38-20.803V18.454h-.004l.005-21.47c8.9 3.034 15.328 11.46 15.373 21.363h.006V70.29Z"
              clipRule="evenodd"
            />
            <Path
              fill="url(#e)"
              d="M74.707 44.816c-.268-9.686-6.624-17.851-15.38-20.804v43.509c.268 9.686 6.625 17.85 15.38 20.803V44.816Z"
            />
          </G>
        </G>
      </G>
    </G>
    <Defs>
      <LinearGradient id="d" x1={5.41} x2={56.02} y1={16.181} y2={94.554} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#282655" />
        <Stop offset={1} stopColor="#3AE77E" />
      </LinearGradient>
      <LinearGradient id="e" x1={58.69} x2={93.394} y1={24.254} y2={116.8} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#282655" />
        <Stop offset={1} stopColor="#3AE77E" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 92.546V0h76.114v92.546z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CardBackgroundShape;
