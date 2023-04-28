// import Matter from "matter-js";
// import { useEffect, useMemo, useRef } from "react";

// const BouncingPhysics = () => {
//   const containerWidth = 1920 / 1.5;
//   const containerHeight = 1080 / 1.5;
//   const circleDiameter = 200;
//   const colors = useMemo(
//     () => ["bg-red-500", "bg-blue-500", "bg-green-500"],
//     []
//   );

//   const containerRef = useRef<HTMLDivElement>(null);
//   const circlesRefs = useRef<{ [color: string]: HTMLDivElement }>({});

//   const engine = useMemo(() => Matter.Engine.create(), []);
//   const world = useMemo(() => engine.world, [engine]);
//   const runner = useMemo(() => Matter.Runner.create(), []);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const Render = Matter.Render;
//     const World = Matter.World;
//     const Bodies = Matter.Bodies;

//     const render = Render.create({
//       element: containerRef.current,
//       engine: engine,
//       options: {
//         width: containerWidth,
//         height: containerHeight,
//         wireframes: false,
//         background: "transparent",
//       },
//     });

//     engine.gravity.y = 0;
//     const wallOptions = {
//       isStatic: true,
//       render: {
//         visible: true,
//         fillStyle: "transparent",
//         strokeStyle: "white",
//         lineWidth: 3,
//       },
//       restitution: 0.99,
//     };
//     const ground = Bodies.rectangle(
//       containerWidth / 2,
//       containerHeight - 1,
//       containerWidth,
//       2,
//       wallOptions
//     );
//     const leftWall = Bodies.rectangle(
//       1,
//       containerHeight / 2,
//       2,
//       containerHeight,
//       wallOptions
//     );
//     const rightWall = Bodies.rectangle(
//       containerWidth - 1,
//       containerHeight / 2,
//       2,
//       containerHeight,
//       wallOptions
//     );
//     const ceiling = Bodies.rectangle(
//       containerWidth / 2,
//       1,
//       containerWidth,
//       2,
//       wallOptions
//     );

//     World.add(world, [ground, leftWall, rightWall, ceiling]);

//     const circles = colors.map((color) => {
//       const circle = Bodies.circle(
//         Math.random() * (containerWidth - circleDiameter) + circleDiameter / 2,
//         Math.random() * (containerHeight - circleDiameter) + circleDiameter / 2,
//         circleDiameter / 2,
//         {
//           restitution: 0.99,
//           friction: 0,
//           frictionAir: 0,
//           label: color,
//           inertia: Infinity,
//         }
//       );
//       Matter.Body.setVelocity(circle, {
//         x: Math.random() * 4 - 2,
//         y: Math.random() * 4 - 2,
//       });
//       return circle;
//     });

//     World.add(world, circles);

//     Matter.Events.on(engine, "afterUpdate", () => {
//       circles.forEach((circle) => {
//         const color = circle.label as string;
//         const circleDiv = circlesRefs.current[color];

//         if (circleDiv) {
//           circleDiv.style.transform = `translate(${
//             circle.position.x - circleDiameter / 2
//           }px, ${circle.position.y - circleDiameter / 2}px)`;
//         }
//       });
//     });

//     Matter.Runner.run(runner, engine);
//     Matter.Render.run(render);

//     return () => {
//       Matter.Render.stop(render);
//       Matter.Runner.stop(runner);
//       Matter.World.clear(world, true);
//       Matter.Engine.clear(engine);
//     };
//   }, [engine, world, runner, colors, containerWidth, containerHeight]);

//   const containerStyle = {
//     position: "relative" as const,
//     width: `${containerWidth}px`,
//     height: `${containerHeight}px`,
//     overflow: "hidden",
//   };
//   return (
//     <div ref={containerRef} style={containerStyle}>
//       {colors.map((color) => (
//         <div
//           key={color}
//           ref={(el) => {
//             if (el) circlesRefs.current[color] = el;
//           }}
//           className={`absolute ${color}`}
//           style={{
//             width: `${circleDiameter}px`,
//             height: `${circleDiameter}px`,
//             borderRadius: "50%",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default BouncingPhysics;
