"use client";

import { ProvideSocketIoClient } from "@/providers/SocketIoProvider";
import Metrics from "./Metrics";

const DashBoardPage = () => {
  return (
    <div className="w-full">
      <ProvideSocketIoClient>
        <Metrics />
      </ProvideSocketIoClient>
    </div>
  );
};

export default DashBoardPage;
