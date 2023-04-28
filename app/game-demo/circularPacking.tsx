// import * as d3 from "d3";
// import { HierarchyNode } from "d3";
// import { useEffect, useRef } from "react";
// import { data } from "./data";

// interface TeamData {
//   team: string;
//   children: {
//     name: string;
//     points: number;
//   }[];
// }

// const teamData: TeamData[] = [
//   { team: "Red", children: [] },
//   { team: "Blue", children: [] },
//   { team: "Yellow", children: [] },
//   { team: "Green", children: [] },
// ];

// for (let i = 0; i < data.length; i++) {
//   const teamIndex = teamData.findIndex((d) => d.team === data[i].team);
//   if (teamIndex > -1) {
//     if (!teamData[teamIndex].children) teamData[teamIndex].children = [];
//     teamData[teamIndex].children.push({
//       name: data[i].name,
//       points: data[i].points,
//     });
//   }
// }

// const hierarchy: HierarchyNode<{ children: TeamData[] }> = d3
//   .hierarchy({ children: teamData })
//   .sum((d) => (d as unknown as { name: string; points: number }).points || 0)
//   .sort((a, b) => b.value! - a.value!);

// const pack = d3.pack().size([1000, 1000]).padding(10);

// export default function CircularPacking() {
//   const ref = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     if (ref.current) {
//       const svg = d3.select(ref.current);

//       const nodes = pack(hierarchy as HierarchyNode<unknown>).descendants();

//       const teamCircles = svg
//         .selectAll("g")
//         .data(nodes.filter((d) => d.depth === 1))
//         .enter()
//         .append("g")
//         .attr("transform", (d) => `translate(${d.x},${d.y})`);

//       teamCircles
//         .append("circle")
//         .classed("bg-gray-400 hover:bg-gray-500 cursor-pointer", true)
//         .attr("r", (d) => d.r)
//         .attr("fill", (d) => (d.data as TeamData).team.toLowerCase())
//         .attr("opacity", 0.55)
//         .attr("stroke", "black")
//         .attr("stroke-width", 2)
//         .on("mouseover", (event, d) => {
//           d3.select(event.currentTarget)
//             .attr("opacity", 1)
//             .attr("stroke-width", 4);
//         })
//         .on("mouseout", (event, d) => {
//           d3.select(event.currentTarget)
//             .attr("opacity", 0.55)
//             .attr("stroke-width", 2);
//           d3.select("#tooltip").style("display", "none");
//         });

//       svg
//         .selectAll("circle.member")
//         .data(nodes.filter((d) => d.depth === 2))
//         .enter()
//         .append("circle")
//         .attr("class", "member")
//         .attr("r", (d) => d.r)
//         .attr("cx", (d) => d.x)
//         .attr("cy", (d) => d.y)
//         .attr("fill", (d) => (d.parent?.data as TeamData).team.toLowerCase())
//         .attr("stroke", "black")
//         .attr("class", "bg-gray-200 hover:bg-gray-300 cursor-pointer");

//       svg
//         .selectAll("text.member")
//         .data(nodes.filter((d) => d.depth === 2))
//         .enter()
//         .append("text")
//         .attr("class", "member")
//         .text(
//           (d) =>
//             (
//               d.data as {
//                 name: string;
//                 points: number;
//               }
//             ).name
//         )
//         .attr("x", (d) => d.x)
//         .attr("y", (d) => d.y)
//         .attr("text-anchor", "middle")
//         .attr("dy", "0.35em")
//         .style("font-size", "0.6em")
//         .attr("class", "text-gray-900 cursor-pointer");
//     }
//   }, []);

//   return (
//     <div className="h-full w-full">
//       <svg
//         ref={ref}
//         xmlns="http://www.w3.org/2000/svg"
//         className="flex h-full w-full rounded-lg shadow-xl"
//       />
//     </div>
//   );
// }
