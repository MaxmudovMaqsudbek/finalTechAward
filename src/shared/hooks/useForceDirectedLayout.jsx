/* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useRef, useState } from "react";

import { useEffect, useMemo, useState } from "react";

export const useForceDirectedLayout = ({
  nodes: initialNodes,
  links: initialLinks,
  width,
  height,
}) => {
  const [graph, setGraph] = useState({ nodes: [], links: [] });

  // FIX: Create a stable key from the data to use as a dependency.
  // This prevents the effect from re-running unnecessarily and causing an infinite loop.
  const graphKey = useMemo(() => {
    if (!initialNodes || initialNodes.length === 0) return "empty";
    const nodeIds = initialNodes
      .map((n) => n.id)
      .sort()
      .join(",");
    const linkIds = initialLinks
      .map((l) => `${l.source},${l.target}`)
      .sort()
      .join(";");
    return `${nodeIds}|${linkIds}`;
  }, [initialNodes, initialLinks]);

  useEffect(() => {
    if (
      !initialNodes ||
      initialNodes.length === 0 ||
      width === 0 ||
      height === 0
    ) {
      setGraph({ nodes: [], links: [] });
      return;
    }

    const linkCounts = new Map();
    initialLinks.forEach((link) => {
      linkCounts.set(link.source, (linkCounts.get(link.source) || 0) + 1);
      linkCounts.set(link.target, (linkCounts.get(link.target) || 0) + 1);
    });

    let nodes = initialNodes.map((n) => ({
      ...n,
      x: width / 2 + Math.random() * 40 - 20,
      y: height / 2 + Math.random() * 40 - 20,
      vx: 0,
      vy: 0,
      radius: 20 + (linkCounts.get(n.id) || 0) * 4,
    }));
    let links = initialLinks.map((l) => ({ ...l }));

    const tick = () => {
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target) return;
        const dx = target.x - source.x,
          dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const idealDistance = 220;
        const force = (0.03 * (distance - idealDistance)) / distance;
        const fx = force * dx,
          fy = force * dy;
        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i],
            nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x,
            dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const combinedRadius = nodeA.radius + nodeB.radius;
          const repulsion = -500 / (distance * distance);
          nodeA.vx += (repulsion * dx) / distance;
          nodeA.vy += (repulsion * dy) / distance;
          nodeB.vx -= (repulsion * dx) / distance;
          nodeB.vy -= (repulsion * dy) / distance;
          if (distance < combinedRadius) {
            const overlap = (combinedRadius - distance) / distance;
            const fx = dx * overlap * 0.5,
              fy = dy * overlap * 0.5;
            nodeA.vx -= fx;
            nodeA.vy -= fy;
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }
      }
      nodes.forEach((node) => {
        node.vx += (width / 2 - node.x) * 0.005;
        node.vy += (height / 2 - node.y) * 0.005;
      });
      const damping = 0.95;
      nodes.forEach((node) => {
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });
    };

    let frameId;
    let currentTick = 0;
    const animate = () => {
      if (currentTick < 150) {
        tick();
        // This state update is safe because it's inside a self-cancelling animation loop
        setGraph({ nodes: [...nodes], links: [...links] });
        currentTick++;
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [graphKey, width, height]); // Use the stable key as a dependency

  return graph;
};
