import * as d3 from "d3";
import { HierarchyNode } from "d3";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { data } from "./data";
import { colorNameToColor } from "./utils";

interface Data {
  team: string;
  name: string;
  points: number;
}

interface TeamCircleProps {
  width: number;
  height: number;
  teamColor: string;
}

const TeamCircle: React.ForwardRefRenderFunction<
  SVGSVGElement,
  TeamCircleProps
> = ({ width, height, teamColor }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => svgRef.current as SVGSVGElement, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const teamData = [
      { team: "Red", children: [] as { name: string; points: number }[] },
      { team: "Blue", children: [] as { name: string; points: number }[] },
      { team: "Yellow", children: [] as { name: string; points: number }[] },
      { team: "Green", children: [] as { name: string; points: number }[] },
    ];

    for (let i = 0; i < data.length; i++) {
      const teamIndex = teamData.findIndex(function (d) {
        return d.team == data[i].team;
      });
      if (teamIndex > -1) {
        if (!teamData[teamIndex].children) teamData[teamIndex].children = [];
        teamData[teamIndex].children.push({
          name: data[i].name,
          points: data[i].points,
        });
      }
    }

    // Filter teamData to keep only Team Red
    const redTeamData = teamData.filter((d) => d.team === teamColor)[0];

    const hierarchy = d3
      .hierarchy(redTeamData)
      .sum(
        (d) => (d as unknown as { name: string; points: number }).points || 0
      )
      .sort((a, b) => b.value! - a.value!);

    const pack = d3.pack().size([width, height]).padding(10);

    const nodes = pack(hierarchy as HierarchyNode<unknown>).descendants();

    const svg = d3.select(svgRef.current);

    const teamCircle = svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", nodes[0].r)
      .attr("fill", colorNameToColor(teamColor))
      .attr("opacity", 0.3)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    const memberCircles = svg
      .selectAll("circle.member")
      .data(nodes.filter((d) => d.depth === 1))
      .enter()
      .append("circle")
      .attr("class", "member")
      .attr("r", (d) => d.r)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", colorNameToColor(teamColor))
      .attr("stroke", "black");
    const memberLabels = svg
      .selectAll("text.member")
      .data(nodes.filter((d) => d.depth === 1))
      .enter()
      .append("text")
      .attr("class", "member")
      .text(
        (d) =>
          (
            d.data as {
              name: string;
              points: number;
            }
          ).name
      )
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", (d) => `${d.r / 3}px`);
  }, [height, teamColor, width]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default forwardRef(TeamCircle);
