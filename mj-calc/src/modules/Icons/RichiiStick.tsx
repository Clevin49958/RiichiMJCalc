import React, { SVGProps } from "react";

function richiiStick(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 18" {...props}>
      <rect x = "0" y ="0" width="56" height="18" fill = "white" stroke = "black" rx="5" />    <circle  cx="28" cy="9" r="5" fill="red"/>
    </svg>
  );
}

export default richiiStick;