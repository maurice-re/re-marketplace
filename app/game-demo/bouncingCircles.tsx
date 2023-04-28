// import Matter, { Engine, World } from "matter-js";
// import { useEffect, useMemo, useRef } from "react";
// import Physics from "./physics";

// const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];

// const BouncingCircles = () => {
//   const containerWidth = 500;
//   const containerHeight = 500;
//   const circleDiameter = 80;

//   const circlesRefs = useRef<Record<string, HTMLDivElement>>({});

//   const engine = useMemo(() => Engine.create(), []);
//   const world = useMemo(() => engine.world, [engine]);

//   useEffect(() => {
//     const Bodies = Matter.Bodies;

//     const circles = colors.map((color) => {
//       const circle = Bodies.circle(
//         Math.random() * (containerWidth - circleDiameter) + circleDiameter / 2,
//         Math.random() * (containerHeight - circleDiameter) + circleDiameter / 2,
//         circleDiameter / 2,
//         {
//           restitution: 1,
//           friction: 0.3,
//           frictionAir: 0,
//           label: color,
//         }
//       );

//       Matter.Body.setVelocity(circle, {
//         x: Math.random() * 1 - 2,
//         y: Math.random() * 1 - 2,
//       });

//       return circle;
//     });

//     console.log("Add Circles");
//     World.add(engine.world, circles);

//     const updateCirclePositions = () => {
//       circles.forEach((circle) => {
//         const element = circlesRefs.current[circle.label];
//         if (element) {
//           element.style.transform = `translate(${
//             circle.position.x - circleDiameter / 2
//           }px, ${circle.position.y - circleDiameter / 2}px)`;
//         }
//       });

//       requestAnimationFrame(updateCirclePositions);
//     };

//     updateCirclePositions();

//     const runner = Matter.Runner.create();
//     Matter.Runner.run(runner, engine);

//     return () => {
//       Matter.Runner.stop(runner);
//       World.clear(engine.world, true);
//       Engine.clear(engine);
//     };
//   }, [containerWidth, containerHeight, circleDiameter, engine]);

//   return (
//     <Physics
//       width={containerWidth}
//       height={containerHeight}
//       engine={engine}
//       world={world}
//     >
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
//     </Physics>
//   );
// };

// export default BouncingCircles;
