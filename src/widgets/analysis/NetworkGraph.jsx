// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useForceDirectedLayout } from "../../shared/hooks/useForceDirectedLayout";

// const nodeColorPalette = [
//   { fill: "#dbeafe", stroke: "#60a5fa" }, // blue
//   { fill: "#dcfce7", stroke: "#4ade80" }, // green
//   { fill: "#fef3c7", stroke: "#facc15" }, // yellow
//   { fill: "#fee2e2", stroke: "#f87171" }, // red
//   { fill: "#f5d0fe", stroke: "#e879f9" }, // fuchsia
//   { fill: "#cffafe", stroke: "#22d3ee" }, // cyan
//   { fill: "#e0e7ff", stroke: "#818cf8" }, // indigo
//   { fill: "#fae8ff", stroke: "#d946ef" }, // purple
// ];


// export  const NetworkGraph = React.memo(({ data, theme }) => {
//   const containerRef = useRef();
//   const [dimensions, setDimensions] = useState({ width: 400, height: 400 }); // Start with non-zero dimensions

//   useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries) => {
//       if (entries[0]) {
//         const { width, height } = entries[0].contentRect;
//         setDimensions({ width: Math.max(width, 100), height: Math.max(height, 100) }); // Ensure minimum size
//       }
//     });
//     const currentRef = containerRef.current;
//     if (currentRef) {
//       resizeObserver.observe(currentRef);
//     }
//     return () => {
//       if (currentRef) {
//         resizeObserver.unobserve(currentRef);
//       }
//     };
//   }, []);

//   const { nodes, links } = useForceDirectedLayout({
//     nodes: data?.nodes || [],
//     links: data?.links || [],
//     width: dimensions.width,
//     height: dimensions.height,
//   });

//   const textColors =
//     theme === "light"
//       ? { text: "#1e293b", year: "#475569" }
//       : { text: "#000", year: "#1e293b" };
//   const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

//   // Add debug logging
//   console.log('NetworkGraph render:', { 
//     dataNodes: data?.nodes?.length || 0, 
//     dataLinks: data?.links?.length || 0,
//     processedNodes: nodes.length,
//     processedLinks: links.length,
//     dimensions 
//   });

//   return (
//     <div ref={containerRef} className="w-full h-full">
//       <svg
//         viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
//         className="w-full h-full"
//       >
//         <g>
//           {links.map((link, i) => {
//             const source = nodeMap.get(link.source);
//             const target = nodeMap.get(link.target);
//             if (!source || !target) return null;
//             return (
//               <line
//                 key={`line-${i}`}
//                 x1={source.x}
//                 y1={source.y}
//                 x2={target.x}
//                 y2={target.y}
//                 stroke={theme === "light" ? "#cbd5e1" : "#475569"}
//                 strokeWidth="1"
//               />
//             );
//           })}
//         </g>
//         <g>
//           {nodes.map((node, index) => {
//             const color = nodeColorPalette[index % nodeColorPalette.length];
//             return (
//               <g
//                 key={node.id}
//                 style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
//                 className="cursor-pointer"
//               >
//                 <circle
//                   r={node.radius || 20}
//                   fill={color.fill}
//                   stroke={color.stroke}
//                   strokeWidth="2"
//                 />
//                 <text
//                   textAnchor="middle"
//                   style={{ pointerEvents: "none" }}
//                   fontSize={(node.radius || 20) / 3.5}
//                   fill={textColors.text}
//                   fontWeight="600"
//                 >
//                   <tspan x="0" dy="-0.1em">
//                     {node.id}
//                   </tspan>
//                   <tspan
//                     x="0"
//                     dy="1.2em"
//                     fontSize="0.9em"
//                     fill={textColors.year}
//                   >{`'${String(node.year || 20).slice(-2)}`}</tspan>
//                 </text>
//               </g>
//             );
//           })}
//         </g>
//       </svg>
//     </div>
//   );
// });
























import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForceDirectedLayout } from "../../shared/hooks/useForceDirectedLayout";

const nodeColorPalette = [
  { fill: "#dbeafe", stroke: "#60a5fa" }, // blue
  { fill: "#dcfce7", stroke: "#4ade80" }, // green
  { fill: "#fef3c7", stroke: "#facc15" }, // yellow
  { fill: "#fee2e2", stroke: "#f87171" }, // red
  { fill: "#f5d0fe", stroke: "#e879f9" }, // fuchsia
  { fill: "#cffafe", stroke: "#22d3ee" }, // cyan
  { fill: "#e0e7ff", stroke: "#818cf8" }, // indigo
  { fill: "#fae8ff", stroke: "#d946ef" }, // purple
];


export const NetworkGraph = React.memo(({ data, theme }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 }); // Start with non-zero dimensions

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width: Math.max(width, 100), height: Math.max(height, 100) }); // Ensure minimum size
      }
    });
    const currentRef = containerRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  const { nodes, links } = useForceDirectedLayout({
    nodes: data?.nodes || [],
    links: data?.links || [],
    width: dimensions.width,
    height: dimensions.height,
  });

  const textColors =
    theme === "light"
      ? { text: "#1e293b", year: "#475569" }
      : { text: "#000", year: "#1e293b" };
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Add debug logging
  console.log('NetworkGraph render:', { 
    dataNodes: data?.nodes?.length || 0, 
    dataLinks: data?.links?.length || 0,
    processedNodes: nodes.length,
    processedLinks: links.length,
    dimensions 
  });

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        <g>
          {links.map((link, i) => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);
            if (!source || !target) return null;
            return (
              <line
                key={`line-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={theme === "light" ? "#cbd5e1" : "#475569"}
                strokeWidth="1"
              />
            );
          })}
        </g>
        <g>
          {nodes.map((node, index) => {
            const color = nodeColorPalette[index % nodeColorPalette.length];
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
              >
                <circle
                  r={node.radius || 20}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth="2"
                />
                <text
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                  fill={textColors.text}
                  fontWeight="600"
                >
                  <tspan 
                    x="0" 
                    dy="-0.1em"
                    fontSize={Math.min((node.radius || 20) / 4, 12)}
                  >
                    {node.id.length > 12 ? node.id.substring(0, 10) + '...' : node.id}
                  </tspan>
                  <tspan
                    x="0"
                    dy="1.2em"
                    fontSize={Math.min((node.radius || 20) / 5, 10)}
                    fill={textColors.year}
                  >{`'${String(node.year || 20).slice(-2)}`}</tspan>
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
});