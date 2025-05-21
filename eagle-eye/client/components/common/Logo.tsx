import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={cn(className)}
      src={logo}
      alt="logo"
      width={100}
      height={100}
    />
  );
};

export default Logo;
