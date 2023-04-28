// import * as d3 from "d3";
// import { HierarchyNode } from "d3";
// import React, { useEffect, useRef } from "react";
// import { data } from "./data";

// interface Data {
//   team: string;
//   name: string;
//   points: number;
// }

// const TeamRedChart: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     const teamData = [
//       { team: "Red", children: [] as { name: string; points: number }[] },
//       { team: "Blue", children: [] as { name: string; points: number }[] },
//       { team: "Yellow", children: [] as { name: string; points: number }[] },
//       { team: "Green", children: [] as { name: string; points: number }[] },
//     ];

//     for (let i = 0; i < data.length; i++) {
//       const teamIndex = teamData.findIndex(function (d) {
//         return d.team == data[i].team;
//       });
//       if (teamIndex > -1) {
//         if (!teamData[teamIndex].children) teamData[teamIndex].children = [];
//         teamData[teamIndex].children.push({
//           name: data[i].name,
//           points: data[i].points,
//         });
//       }
//     }

//     // Filter teamData to keep only Team Red
//     const redTeamData = teamData.filter((d) => d.team === "Red")[0];

//     const hierarchy = d3
//       .hierarchy(redTeamData)
//       .sum(
//         (d) => (d as unknown as { name: string; points: number }).points || 0
//       )
//       .sort((a, b) => b.value! - a.value!);

//     const pack = d3.pack().size([1000, 1000]).padding(10);

//     const nodes = pack(hierarchy as HierarchyNode<unknown>).descendants();

//     const svg = d3.select(svgRef.current);

//     const teamCircle = svg
//       .append("circle")
//       .attr("cx", 1000 / 2)
//       .attr("cy", 1000 / 2)
//       .attr("r", nodes[0].r)
//       .attr("fill", "red")
//       .attr("opacity", 0.55)
//       .attr("stroke", "black")
//       .attr("stroke-width", 2);

//     const memberCircles = svg
//       .selectAll("circle.member")
//       .data(nodes.filter((d) => d.depth === 1))
//       .enter()
//       .append("circle")
//       .attr("class", "member")
//       .attr("r", (d) => d.r)
//       .attr("cx", (d) => d.x)
//       .attr("cy", (d) => d.y)
//       .attr("fill", "red")
//       .attr("stroke", "black");

//     const memberLabels = svg
//       .selectAll("text.member")
//       .data(nodes.filter((d) => d.depth === 1))
//       .enter()
//       .append("text")
//       .attr("class", "member")
//       .text(
//         (d) =>
//           (
//             d.data as {
//               name: string;
//               points: number;
//             }
//           ).name
//       )
//       .attr("x", (d) => d.x)
//       .attr("y", (d) => d.y)
//       .attr("text-anchor", "middle")
//       .attr("dy", "0.35em")
//       .style("font-size", "0.6em");
//   }, []);

//   return <svg ref={svgRef} width={1000} height={1000} />;
// };

// export default TeamRedChart;
