import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { generalData } from "@/data/general";
import Link from "next/link";
import React from "react";

const MainPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
      <Logo className="w-10 h-10" />
      <h1 className="text-4xl font-bold uppercase">{generalData.title}</h1>
      <Link href="/dashboard">
        <Button variant="outline" className="uppercase">
          Get Started
        </Button>
      </Link>
      <p className="text-xs text-muted-foreground">
        Version {generalData.version}
      </p>
    </div>
  );
};

export default MainPage;
