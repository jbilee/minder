"use client";

import { useState, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import Bubble from "./Bubble";
import NewBubbleForm from "./NewBubbleForm";
import type { KonvaEventObject } from "konva/lib/Node";

type BubbleProps = {
  text: string;
  id: string;
  x: number;
  y: number;
};

type RectConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

const haveIntersection = (r1: RectConfig, r2: RectConfig) => {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
};

export default function KonvaCanvas() {
  const currentTarget = useRef<null | Konva.Group>(null);
  const inRange = useRef<Konva.Group[]>([]);
  const [canvasSize, setCanvasSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ x: window.innerWidth, y: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    Konva.hitOnDragEnabled = true; // For pinch zoom on touch devices -- remove if there's conflict with other pieces of code
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const createBubble = (text: string) => {
    const newBubble = {
      text,
      id: crypto.randomUUID(),
      x: getRandomValue(0, 900),
      y: getRandomValue(0, 500),
    };
    setBubbles((prev) => [...prev, newBubble]);
  };

  const activate = (target: Konva.Group) => {
    const rect = target.children[0] as Konva.Rect;
    rect.fill("yellow");
    rect.stroke("black");
  };

  const deactivate = (target: Konva.Group) => {
    const rect = target.children[0] as Konva.Rect;
    rect.fill("blue");
    rect.stroke("");
  };

  const getCoverage = (r1: RectConfig, r2: RectConfig) => {
    const xDifference = r1.x < r2.x ? r1.x + r1.width - r2.x : r2.x + r2.width - r1.x;
    const yDifference = r1.y < r2.y ? r1.y + r1.height - r2.y : r2.y + r2.height - r1.y;
    return xDifference * yDifference;
  };

  const findClosest = (array: Konva.Group[], target: RectConfig) => {
    const closest = array.reduce((max, cur) => {
      const maxCoverage = max ? getCoverage(max.getClientRect(), target) : 0;
      const curCoverage = getCoverage(cur.getClientRect(), target);
      return maxCoverage > curCoverage ? max : cur;
    }, array[0]);
    return closest!;
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const layerComp = e.currentTarget as Konva.Layer;
    const target = e.target as Konva.Group;
    target.setZIndex(100);
    layerComp.children.forEach((group) => {
      if (group === target) return;
      if (group instanceof Konva.Group) {
        if (
          haveIntersection(
            (group.children[0] as Konva.Rect).getClientRect(),
            (target.children[0] as Konva.Rect).getClientRect()
          )
        ) {
          if (!inRange.current.includes(group)) {
            inRange.current.push(group);
          }
          if (inRange.current.length === 1) {
            currentTarget.current = group;
            activate(group);
          }
          if (inRange.current.length > 1) {
            const closest = findClosest(inRange.current, target.getClientRect());
            inRange.current.forEach((comp) => {
              if (comp !== closest) deactivate(comp);
            });
            activate(closest);
            currentTarget.current = closest;
          }
        } else {
          if (inRange.current.includes(group)) {
            inRange.current = inRange.current.filter((comp) => comp !== group);
            deactivate(group);
          }
          if (currentTarget.current === group) currentTarget.current = null;
        }
      }
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    console.log(e);
    // const layerComp = e.currentTarget as Konva.Layer;
    // const target = e.target as Konva.Group;
    // const rect = (target.children[0] as Konva.Rect).getClientRect()
    // push out of bounds
    if (currentTarget.current) {
      // const barrier = currentTarget.current.getClientRect()
      // const xoffset = barrier.x < rect.x ? barrier.x - rect.width : barrier.x + barrier.width
      // const yoffset = barrier.y < rect.y ? barrier.y - rect.height : barrier.y + barrier.height
      // target.setPosition({x: 0, y: 0})
      deactivate(currentTarget.current);
    }
  };

  return (
    <>
      <div>
        <Stage width={canvasSize.x} height={canvasSize.y} draggable>
          <Layer onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
            {bubbles.map((elem) => (
              <Bubble key={elem.id} text={elem.text} x={elem.x} y={elem.y} />
            ))}
          </Layer>
        </Stage>
      </div>
      <NewBubbleForm createBubble={createBubble} />
    </>
  );
}
