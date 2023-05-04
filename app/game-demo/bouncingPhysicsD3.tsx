import Matter from "matter-js";
import { useEffect, useMemo, useRef } from "react";
import { data } from "./data";
import TeamCircle from "./teamCircle";
import { getColorName } from "./utils";

type PointTotals = { [team: string]: number };
function calculatePointTotals(
  data: { team: string; name: string; points: number }[]
): PointTotals {
  const pointTotals: PointTotals = {};

  for (const { team, points } of data) {
    if (pointTotals[team]) {
      pointTotals[team] += points;
    } else {
      pointTotals[team] = points;
    }
  }

  return pointTotals;
}
const maxSize = 500;
const teamPointTotals = calculatePointTotals(data);
const highestScore = Math.max(...Object.values(teamPointTotals));

const BouncingPhysicsD3 = () => {
  const containerWidth = 1920 / 1.25;
  const containerHeight = 1080 / 1.25;
  const getCircleDiameter = (color: string) => {
    const colorName = getColorName(color);
    return Math.floor(maxSize * (teamPointTotals[colorName] / highestScore));
  };
  const colors = useMemo(
    () => ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"],
    []
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRefs = useRef<{ [color: string]: HTMLDivElement }>({});

  const engine = useMemo(() => Matter.Engine.create(), []);
  const world = useMemo(() => engine.world, [engine]);
  const runner = useMemo(() => Matter.Runner.create(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    engine.gravity.x = -0.01;
    engine.gravity.y = 0;
    engine.gravity.scale = 0.0001;
    const wallOptions = {
      isStatic: true,
      render: {
        visible: true,
        fillStyle: "transparent",
        strokeStyle: "white",
        lineWidth: 3,
      },
      restitution: 1,
    };
    const ground = Bodies.rectangle(
      containerWidth / 2,
      containerHeight - 1,
      containerWidth,
      2,
      wallOptions
    );
    const leftWall = Bodies.rectangle(
      1,
      containerHeight / 2,
      2,
      containerHeight,
      wallOptions
    );
    const rightWall = Bodies.rectangle(
      containerWidth - 1,
      containerHeight / 2,
      2,
      containerHeight,
      wallOptions
    );
    const ceiling = Bodies.rectangle(
      containerWidth / 2,
      1,
      containerWidth,
      2,
      wallOptions
    );

    World.add(world, [ground, leftWall, rightWall, ceiling]);

    const circles = colors.map((color) => {
      const circle = Bodies.circle(
        Math.random() * (containerWidth - getCircleDiameter(color)) +
          getCircleDiameter(color) / 2,
        Math.random() * (containerHeight - getCircleDiameter(color)) +
          getCircleDiameter(color) / 2,
        getCircleDiameter(color) / 2,
        {
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          label: color,
          inertia: Infinity,
        }
      );
      Matter.Body.setVelocity(circle, {
        x: Math.random() * 10 - 2,
        y: Math.random() * 8 - 2,
      });
      return circle;
    });

    World.add(world, circles);

    Matter.Events.on(engine, "afterUpdate", () => {
      circles.forEach((circle) => {
        const color = circle.label as string;
        const circleElement = circlesRefs.current[
          color
        ] as unknown as SVGElement;

        if (circleElement) {
          if (
            color === "bg-red-500" ||
            color === "bg-blue-500" ||
            color === "bg-green-500" ||
            color === "bg-yellow-500"
          ) {
            circleElement.setAttribute(
              "x",
              `${circle.position.x - (circle.circleRadius || 0)}`
            );
            circleElement.setAttribute(
              "y",
              `${circle.position.y - (circle.circleRadius || 0)}`
            );
          } else {
            (circleElement as SVGCircleElement).setAttribute(
              "cx",
              `${circle.position.x}`
            );
            (circleElement as SVGCircleElement).setAttribute(
              "cy",
              `${circle.position.y}`
            );
          }
        }
      });
    });
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, true);
      Matter.Engine.clear(engine);
    };
  }, [engine, world, runner, colors, containerWidth, containerHeight]);

  const containerStyle = {
    position: "relative" as const,
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
    overflow: "hidden",
  };
  return (
    <div ref={containerRef} style={containerStyle}>
      <svg width={containerWidth} height={containerHeight}>
        {colors.map((color) => {
          if (color === "bg-red-500") {
            return (
              <TeamCircle
                key={color}
                teamColor={getColorName(color)}
                width={getCircleDiameter(color)}
                height={getCircleDiameter(color)}
                ref={(el) => {
                  if (el)
                    circlesRefs.current[color] =
                      el as unknown as HTMLDivElement;
                }}
              />
            );
          } else if (color === "bg-blue-500") {
            return (
              <TeamCircle
                key={color}
                teamColor={getColorName(color)}
                width={getCircleDiameter(color)}
                height={getCircleDiameter(color)}
                ref={(el) => {
                  if (el)
                    circlesRefs.current[color] =
                      el as unknown as HTMLDivElement;
                }}
              />
            );
          } else if (color === "bg-green-500") {
            return (
              <TeamCircle
                key={color}
                teamColor={getColorName(color)}
                width={getCircleDiameter(color)}
                height={getCircleDiameter(color)}
                ref={(el) => {
                  if (el)
                    circlesRefs.current[color] =
                      el as unknown as HTMLDivElement;
                }}
              />
            );
          } else if (color === "bg-yellow-500") {
            return (
              <TeamCircle
                key={color}
                teamColor={getColorName(color)}
                width={getCircleDiameter(color)}
                height={getCircleDiameter(color)}
                ref={(el) => {
                  if (el)
                    circlesRefs.current[color] =
                      el as unknown as HTMLDivElement;
                }}
              />
            );
          }
        })}
      </svg>
    </div>
  );
};

export default BouncingPhysicsD3;
