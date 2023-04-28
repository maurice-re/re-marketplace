// import Matter, { Engine, World } from "matter-js";
// import { useEffect, useRef } from "react";

// interface PhysicsProps {
//   engine: Matter.Engine;
//   world: Matter.World;
//   runner: Matter.Runner;
//   width: number;
//   height: number;
//   children: React.ReactNode;
// }

// const Physics: React.FC<PhysicsProps> = ({
//   engine,
//   width,
//   height,
//   children,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const Render = Matter.Render;
//     const Bodies = Matter.Bodies;
//     const Body = Matter.Body;

//     const render = Render.create({
//       element: containerRef.current,
//       engine: engine,
//       options: {
//         width: width,
//         height: height,
//         wireframes: false,
//         background: "transparent",
//       },
//     });

//     const wallOptions = {
//       isStatic: true,
//       render: {
//         visible: true,
//         fillStyle: "transparent",
//         strokeStyle: "white",
//         lineWidth: 2,
//       },
//       restitution: 1,
//     };

//     const ground = Bodies.rectangle(
//       width / 2,
//       height - 1,
//       width,
//       2,
//       wallOptions
//     );
//     const leftWall = Bodies.rectangle(1, height / 2, 2, height, wallOptions);
//     const rightWall = Bodies.rectangle(
//       width - 1,
//       height / 2,
//       2,
//       height,
//       wallOptions
//     );
//     const ceiling = Bodies.rectangle(width / 2, 1, width, 2, wallOptions);

//     console.log("Add Walls");

//     World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

//     Matter.Runner.run(engine);
//     Render.run(render);

//     return () => {
//       Render.stop(render);
//       World.clear(engine.world, true);
//       Engine.clear(engine);
//     };
//   }, [width, height, engine]);

//   const containerStyle = {
//     // eslint-disable-next-line @typescript-eslint/prefer-as-const
//     position: "relative" as "relative",
//     width: `${width}px`,
//     height: `${height}px`,
//     overflow: "hidden",
//   };

//   return (
//     <div ref={containerRef} style={containerStyle}>
//       {children}
//     </div>
//   );
// };

// export default Physics;
