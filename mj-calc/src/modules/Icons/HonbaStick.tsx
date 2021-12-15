import React, { SVGProps } from "react";

function HonbaStick(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 18" {...props}>
       <rect x = "0" y ="0" width="56" height="18" fill = "white" stroke = "black" rx="5" />      <circle  cx="17.5" cy="5.5" r="2" fill="black"/>    <circle  cx="24.5" cy="5.5" r="2" fill="black"/>    <circle  cx="31.5" cy="5.5" r="2" fill="black"/>    <circle  cx="38.5" cy="5.5" r="2" fill="black"/>        <circle  cx="17.5" cy="12.5" r="2" fill="black"/>    <circle  cx="24.5" cy="12.5" r="2" fill="black"/>    <circle  cx="31.5" cy="12.5" r="2" fill="black"/>    <circle  cx="38.5" cy="12.5" r="2" fill="black"/>
    </svg>
  );
}

export default HonbaStick;