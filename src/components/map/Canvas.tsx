"use client";

import { useState, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import Bubble from "./Bubble";
import NewBubbleForm from "./NewBubbleForm";
import { getRandomValue } from "@/utils/calculations";
import type { KonvaEventObject } from "konva/lib/Node";

type BubbleProps = {
  text: string;
  id: string;
  x: number;
  y: number;
  createdAt: string;
  parentNode: string | null;
  childNodes: string[];
};

type RectDimensions = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const haveIntersection = (r1: RectDimensions, r2: RectDimensions) => {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
};

const activate = (target: Konva.Group) => {
  const rect = target.children[5] as Konva.Rect;
  rect.fill("#cbdcf4");
  rect.opacity(0.5);
};

const deactivate = (target: Konva.Group) => {
  const rect = target.children[5] as Konva.Rect;
  rect.fill("");
  rect.opacity(1);
};

const getCoverage = (r1: RectDimensions, r2: RectDimensions) => {
  const xDifference = r1.x < r2.x ? r1.x + r1.width - r2.x : r2.x + r2.width - r1.x;
  const yDifference = r1.y < r2.y ? r1.y + r1.height - r2.y : r2.y + r2.height - r1.y;
  return xDifference * yDifference;
};

const getClosestCorner = (target: RectDimensions, dragged: RectDimensions) => {
  const xAxis = target.x - dragged.x;
  const yAxis = target.y - dragged.y;
  const xCorner = xAxis <= 0 ? 1 : 0;
  const yCorner = yAxis <= 0 ? 1 : 0;
  return { x: xCorner, y: yCorner };
};

const findClosest = (array: Konva.Group[], target: RectDimensions) => {
  const closest = array.reduce((max, cur) => {
    const maxCoverage = max ? getCoverage(max.getClientRect(), target) : 0;
    const curCoverage = getCoverage(cur.getClientRect(), target);
    return maxCoverage > curCoverage ? max : cur;
  }, array[0]);
  return closest;
};

const getObjectsInRange = (array: Konva.Group[], target: RectDimensions) => {
  const inRange = array.reduce<Konva.Group[]>((arr, cur) => {
    const coverage = getCoverage(cur.getClientRect(), target);
    if (coverage > 0) arr.push(cur);
    return arr;
  }, []);
  console.log(inRange);
  return inRange;
};

const pushObjectAway = (dragTarget: Konva.Group, dropTarget: Konva.Group, callback: (t: Konva.Group) => void) => {
  const dragTargetDims = dragTarget.getClientRect();
  const dropTargetDims = dropTarget.getClientRect();
  const xDiff = Math.abs(dragTargetDims.x - dropTargetDims.x);
  const moveX = xDiff >= 160;

  if (moveX) {
    if (dragTargetDims.x <= dropTargetDims.x) {
      dropTarget.move({ x: dragTargetDims.x + dragTargetDims.width - dropTargetDims.x, y: 0 });
      return callback(dropTarget);
    }
    dropTarget.move({ x: -(dropTargetDims.x + dropTargetDims.width - dragTargetDims.x), y: 0 });
    return callback(dropTarget);
  }
  if (dragTargetDims.y <= dropTargetDims.y) {
    dropTarget.move({ x: 0, y: dragTargetDims.y + dragTargetDims.height - dropTargetDims.y });
    return callback(dropTarget);
  }
  dropTarget.move({ x: 0, y: -(dropTargetDims.y + dropTargetDims.height - dragTargetDims.y) });
  callback(dropTarget);
};

export default function Canvas() {
  const layerRef = useRef<null | Konva.Layer>(null);
  const collisionTarget = useRef<null | Konva.Group>(null);
  const bubblesInRange = useRef<Konva.Group[]>([]);
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
      createdAt: new Date().toLocaleString("ko-KR"),
      parentNode: null,
      childNodes: [],
    };
    setBubbles((prev) => [...prev, newBubble]);
  };

  const updatePosition = (target: Konva.Shape | Konva.Group | Konva.Rect) => {
    const newPos = target.getAbsolutePosition(layerRef.current as Konva.Layer);
    const id = target.getAttrs().id;
    setBubbles((prev: BubbleProps[]) => {
      const newArr = prev.filter((bubble) => bubble.id !== id);
      const [targetBubble] = prev.filter((bubble) => bubble.id === id);
      return [...newArr, { ...targetBubble, x: newPos.x, y: newPos.y }];
    });
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const layerComp = e.currentTarget as Konva.Layer;
    const target = e.target as Konva.Group;
    target.setZIndex(bubbles.length - 1);

    layerComp.children.forEach((group) => {
      if (group === target) return;
      if (group instanceof Konva.Group) {
        if (
          haveIntersection(
            (group.children[0] as Konva.Rect).getClientRect(),
            (target.children[0] as Konva.Rect).getClientRect()
          )
        ) {
          if (!bubblesInRange.current.includes(group)) {
            bubblesInRange.current.push(group);
          }
          if (bubblesInRange.current.length === 1) {
            collisionTarget.current = group;
            activate(group);
          }
          if (bubblesInRange.current.length > 1) {
            const closest = findClosest(bubblesInRange.current, target.getClientRect());
            bubblesInRange.current.forEach((comp) => {
              if (comp !== closest) deactivate(comp);
            });
            activate(closest);
            collisionTarget.current = closest;
          }
        } else {
          if (bubblesInRange.current.includes(group)) {
            bubblesInRange.current = bubblesInRange.current.filter((comp) => comp !== group);
            deactivate(group);
          }
          if (collisionTarget.current === group) collisionTarget.current = null;
        }
      }
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const dragged = e.target as Konva.Group;

    if (collisionTarget.current) {
      // const response = confirm("Merge?");
      // if (response) {
      //   // save relationship
      //   // draw line between bubbles
      // }
      // push away
      pushObjectAway(dragged, collisionTarget.current, updatePosition);
      deactivate(collisionTarget.current);
      collisionTarget.current = null;
    }

    // find objects in range
    if (bubblesInRange.current.length) {
      // push away objects in range
      bubblesInRange.current.forEach((bubble) => {
        pushObjectAway(dragged, bubble, updatePosition);
      });
      bubblesInRange.current = [];
    }

    updatePosition(dragged);
  };

  const handleZoom = (e: KonvaEventObject<WheelEvent>) => {
    const deltaY = e.evt.deltaY;
    const currentScale = e.currentTarget.scale();
    if (!currentScale) return;
    if (deltaY < 0) {
      e.currentTarget.scale({ x: (currentScale.x += 0.1), y: (currentScale.y += 0.1) });
    }
    if (deltaY > 0) {
      e.currentTarget.scale({ x: (currentScale.x -= 0.1), y: (currentScale.y -= 0.1) });
    }
  };

  return (
    <>
      <Stage width={canvasSize.x} height={canvasSize.y} onWheel={handleZoom} draggable>
        <Layer onDragMove={handleDragMove} onDragEnd={handleDragEnd} ref={layerRef}>
          {bubbles.map((elem) => (
            <Bubble key={elem.id} id={elem.id} text={elem.text} x={elem.x} y={elem.y} createdAt={elem.createdAt} />
          ))}
        </Layer>
      </Stage>
      <NewBubbleForm createBubble={createBubble} />
    </>
  );
}
