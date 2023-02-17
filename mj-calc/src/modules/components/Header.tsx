import Image from "next/image";
import React from "react";

import { HeaderImage } from "../../../public";

export default function Header() {
  return (
    <Image
      src={HeaderImage}
      alt=""
      height={300}
      width={480}
      style={{ maxHeight: "100%", maxWidth: "100%" }}
      className="mb-4"
    />
  );
}
