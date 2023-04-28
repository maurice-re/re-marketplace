"use client";

import Image from "next/image";
import BouncingPhysicsD3 from "./bouncingPhysicsD3";
import { data } from "./data";
import Ticker from "./ticker";
import { calculatePointTotals, colorNameToColor } from "./utils";

const teamPointTotals = calculatePointTotals(data);

export default function Page() {
  return (
    <div className="flex flex-col overflow-auto">
      <main className="flex h-screen flex-col gap-3 overflow-auto bg-re-dark-green-500 font-theinhardt text-white">
        <Ticker />
        <div className="mx-auto flex items-center gap-4 rounded-md border-3 border-re-gray-300 bg-re-dark-green-300">
          <div className="flex flex-col">
            {Object.entries(teamPointTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([team, points]) => (
                <div key={team} className="flex items-center">
                  <Image
                    src={`/images/team-${team.toLowerCase()}-logo.png`}
                    height={150}
                    width={150}
                    alt={`The logo for team ${team}`}
                  />
                  <div className={`text-2xl ${colorNameToColor(team, true)} `}>
                    {points}
                  </div>
                </div>
              ))}
          </div>

          <BouncingPhysicsD3 />
        </div>
      </main>
    </div>
  );
}
