import { data } from "./data";
import { colorNameToColor } from "./utils";

const recentTransactions = [
  { name: "Lime Leaf", action: "borrow", points: 75 },
  { name: "Indigo Night", action: "borrow", points: 75 },
  { name: "Ember Flame", action: "borrow", points: 75 },
  { name: "Dandelion Wind", action: "return", points: 125 },
  { name: "Cherry Blossom", action: "borrow", points: 75 },
  { name: "Falcon Wing", action: "return", points: 125 },
  { name: "Denim Jeans", action: "return", points: 125 },
  { name: "Gold Rush", action: "borrow", points: 75 },
  { name: "Garnet Heart", action: "return", points: 125 },
];

function Ticker() {
  return (
    <div className="relative flex gap-0 overflow-x-hidden border-b-3 border-re-gray-300 bg-re-dark-green-300">
      <div className="animate-marquee whitespace-nowrap py-4">
        {recentTransactions.map(({ name, points }) => {
          const team = data.find((d) => d.name === name)?.team;
          return (
            <span
              className={`mx-3 text-2xl ${colorNameToColor(team, true)}`}
              key={name}
            >{`${name} +${points}`}</span>
          );
        })}
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-4">
        {recentTransactions.map(({ name, points }) => {
          const team = data.find((d) => d.name === name)?.team;
          return (
            <span
              className={`mx-3 text-2xl ${colorNameToColor(team, true)}`}
              key={name}
            >{`${name} +${points}`}</span>
          );
        })}
      </div>
    </div>
  );
}

export default Ticker;
