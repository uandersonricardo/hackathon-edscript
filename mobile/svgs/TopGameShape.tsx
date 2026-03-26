import React from "react";
import Svg, { SvgProps, G, Path, Defs, RadialGradient, Stop, ClipPath } from "react-native-svg";

const TopGameShape = (props: SvgProps) => (
  <Svg {...props} viewBox="0 0 163 99" fill="none">
    <G clipPath="url(#a)">
      <Path
        fill="url(#b)"
        d="M114.317 99H10C4.477 99 0 94.523 0 89V10C0 4.477 4.477 0 10 0h143.925c6.883 0 11.708 6.791 9.443 13.29l-23.555 67.595A27 27 0 0 1 114.317 99Z"
      />
      <Path
        fill="#07042E"
        fillOpacity={0.4}
        d="M132.211 64.099c-2.793 8.282-10.516 14.295-19.678 14.548H83.178v.004c-3.739 0-6.9 3.159-6.9 6.9.001 3.74 3.16 6.9 6.9 6.9h29.355c9.164.252 16.887 6.267 19.678 14.549H83.022v-.004c-11.755-.084-21.293-9.653-21.293-21.445 0-11.793 9.568-21.393 21.348-21.447V64.1h49.134ZM149.273 35c-2.793 8.282-10.517 14.295-19.68 14.549H88.436c2.793-8.282 10.517-14.295 19.68-14.549h41.157Z"
      />
    </G>
    <G clipPath="url(#c)">
      <Path
        fill="url(#d)"
        d="M27.487 29H9.429A2.93 2.93 0 0 1 6.5 26.07V2.93A2.93 2.93 0 0 1 9.43 0h29.66a2.93 2.93 0 0 1 2.765 3.893l-6.9 19.8A7.91 7.91 0 0 1 27.487 29Z"
      />
    </G>
    <Defs>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-44.5 -82.5 140.159 -77.3053 110 99)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.288} stopColor="#3AE77E" />
        <Stop offset={1} stopColor="#04065B" stopOpacity={0} />
      </RadialGradient>
      <RadialGradient
        id="d"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-27 -21.5 36.2798 -46.4474 31 36.5)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.288} stopColor="#3AE77E" />
        <Stop offset={1} stopColor="#04065B" stopOpacity={0} />
      </RadialGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h154a9 9 0 0 1 9 9v37c0 29.271-23.729 53-53 53H0V0Z" />
      </ClipPath>
      <ClipPath id="c">
        <Path fill="#fff" d="M7 0h32.364A2.636 2.636 0 0 1 42 2.636v10.839C42 22.049 35.05 29 26.475 29H7V0Z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default TopGameShape;
