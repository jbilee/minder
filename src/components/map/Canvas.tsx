"use client";

import { useState, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import Bubble from "./Bubble";
import NewBubbleForm from "./NewBubbleForm";
import { deleteBubble, postBubble, putBubbleArray } from "@/app/actions";
import { getRandomValue } from "@/utils/math";
import type { KonvaEventObject } from "konva/lib/Node";

type CanvasProps = {
  data: BubbleProps[];
  mapId: string;
};

export type BubbleData = {
  text: string;
  x: number;
  y: number;
  parent_node: string | null;
  child_nodes: string[];
  map_id: string;
};

export type BubbleProps = {
  text: string;
  id: string;
  x: number;
  y: number;
  created_at: string;
  parent_node: string | null;
  child_nodes: string[];
};

type EdgeProps = {
  id: string;
  from: string;
  to: string;
};

type Coords = {
  x: number;
  y: number;
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

const initEdges = (bubbles: BubbleProps[]) => {
  const edges: EdgeProps[] = [];
  if (!bubbles.length) return edges;

  bubbles.forEach((bubble) => {
    if (bubble.parent_node) {
      const newEdge = { id: crypto.randomUUID(), from: bubble.id, to: bubble.parent_node };
      edges.push(newEdge);
    }
  });

  return edges;
};

const getEdgePoints = (from: Coords, to: Coords) => {
  return [from.x + 130, from.y + 65, to.x + 130, to.y + 65];
};

export default function Canvas({ data, mapId }: CanvasProps) {
  const stageRef = useRef<null | Konva.Stage>(null);
  const layerRef = useRef<null | Konva.Layer>(null);
  const collisionTarget = useRef<null | Konva.Group>(null);
  const bubblesInRange = useRef<Konva.Group[]>([]);
  const contextRef = useRef<null | HTMLDivElement>(null);
  const contextTargetId = useRef<string>("");
  const [canvasSize, setCanvasSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const [bubbles, setBubbles] = useState<BubbleProps[]>(data);
  const [edges, setEdges] = useState<EdgeProps[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ x: window.innerWidth, y: window.innerHeight });
    };

    const hideContextMenu = () => {
      const contextMenu = contextRef.current;
      if (!contextMenu) return;
      contextMenu.style.display = "none";
    };

    const initialEdges = initEdges(data);
    setEdges(initialEdges);

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", hideContextMenu);
    Konva.hitOnDragEnabled = true; // For pinch zoom on touch devices -- remove if there's conflict with other pieces of code
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", hideContextMenu);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!edges.length) return;

    edges.forEach((edge, i) => {
      if (!layerRef.current) return;
      const line = layerRef.current.findOne("#" + edge.id);
      if (line) return;

      const fromNode = layerRef.current.findOne("#" + edge.from);
      const toNode = layerRef.current.findOne("#" + edge.to);
      const points = getEdgePoints(fromNode!.position(), toNode!.position());

      const newEdge = new Konva.Line({
        id: edge.id,
        stroke: "#007ecc",
        fill: "#007ecc",
        points,
      });

      layerRef.current.add(newEdge);
      newEdge.zIndex(i);
    });
  }, [edges]);

  const createBubble = async (text: string) => {
    const newBubble = {
      text,
      x: getRandomValue(0, 900),
      y: getRandomValue(0, 500),
      parent_node: null,
      child_nodes: [],
      map_id: mapId,
    };
    const result = await postBubble(newBubble);
    if (result) {
      setBubbles((prev) => [...prev, result]);
    }
  };

  const eraseEdge = (fromId: string, toId: string) => {
    if (!layerRef.current) return;
    const [edge] = edges.filter(({ from, to }) => from === fromId && to === toId);
    if (!edge) return;
    const edgeNode = layerRef.current.findOne("#" + edge.id);
    if (!edgeNode) return;
    edgeNode.destroy();
  };

  const removeEdge = (fromId: string, toId: string) => {
    const [edge] = edges.filter(({ from, to }) => from === fromId && to === toId);
    if (!edge) return;
    setEdges((prev) => {
      const newEdges = prev.filter(({ id }) => id !== edge.id);
      return newEdges;
    });
  };

  const addChildNode = async (parentId: string, childId: string) => {
    const newBubbles = [...bubbles];
    const [parent] = newBubbles.filter((bubble) => bubble.id === parentId);
    const [child] = newBubbles.filter((bubble) => bubble.id === childId);

    // Remove childId from previous parent
    if (child.parent_node) {
      eraseEdge(childId, child.parent_node);
      removeEdge(childId, child.parent_node);
      const [prevParent] = newBubbles.filter((bubble) => bubble.id === child.parent_node);
      prevParent.child_nodes = prevParent.child_nodes.filter((id) => id !== childId);
    }

    // If the child is now the parent, reverse the relationship
    if (parent.parent_node === childId) {
      eraseEdge(parentId, childId);
      removeEdge(parentId, childId);
      parent.parent_node = null;
      child.child_nodes = child.child_nodes.filter((id) => id !== parentId);
    }

    child.parent_node = parent.id;
    parent.child_nodes.push(child.id);

    try {
      await putBubbleArray(newBubbles);
      setBubbles(newBubbles);
    } catch (error) {
      // TODO: Notify user
      console.log(error);
    }
  };

  const removeBubble = async () => {
    const response = confirm("Delete this bubble?");
    if (!response) return;
    try {
      await deleteBubble(contextTargetId.current);
      setBubbles((prev) => {
        const remainingBubbles = prev.filter((bubble) => bubble.id !== contextTargetId.current);
        return [...remainingBubbles];
      });
      contextTargetId.current = "";
    } catch (error) {
      // TODO: Notify user
      console.log(error);
    }
  };

  const addEdge = (fromNode: Konva.Group, toNode: Konva.Group) => {
    const fromId = fromNode.getAttrs().id;
    const toId = toNode.getAttrs().id;
    if (!fromId || !toId) return;

    const newEdge = { id: crypto.randomUUID(), from: fromId, to: toId };
    setEdges((prev) => [...prev, newEdge]);
  };

  const changeCursor = (status: string) => {
    if (!stageRef.current) return;
    if (status === "enter" || status === "release") {
      stageRef.current.container().style.cursor = "grab";
    }
    if (status === "leave") {
      stageRef.current.container().style.cursor = "default";
    }
    if (status === "grab") {
      stageRef.current.container().style.cursor = "grabbing";
    }
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

  const handleMouseDown = () => {
    changeCursor("grab");
  };

  const handleMouseUp = () => {
    changeCursor("release");
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const contextMenu = contextRef.current;
    if (contextMenu) {
      contextMenu.style.display = "none";
    }

    const layerComp = e.currentTarget as Konva.Layer;
    const target = e.target as Konva.Group;
    target.setZIndex(bubbles.length + edges.length - 1);

    if (edges.length) {
      edges.forEach((edge) => {
        const line = layerRef.current!.findOne("#" + edge.id);
        if (!line) return;
        const fromNode = layerRef.current!.findOne("#" + edge.from);
        const toNode = layerRef.current!.findOne("#" + edge.to);

        const points = getEdgePoints(fromNode!.position(), toNode!.position());
        (line as any).points(points);
      });
    }

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
    changeCursor("release");
    const dragged = e.target as Konva.Group;
    let response = false;

    if (collisionTarget.current) {
      const collisionTargetId = collisionTarget.current.getAttrs().id;
      const draggedId = dragged.getAttrs().id;
      const [draggedBubble] = bubbles.filter((bubble) => bubble.id === draggedId);
      if (draggedBubble.parent_node !== collisionTargetId) {
        response = true;
        // TODO: display toast regarding the merge
      }
      // push away
      pushObjectAway(dragged, collisionTarget.current, updatePosition);
      deactivate(collisionTarget.current);
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

    if (collisionTarget.current && response) {
      // save relationship
      const parentId = collisionTarget.current.getAttrs().id;
      const childId = dragged.getAttrs().id;
      if (!parentId || !childId) {
        // handle exception
        return;
      }
      addChildNode(parentId, childId);
      addEdge(dragged, collisionTarget.current);

      // TODO: draw line between bubbles
      collisionTarget.current = null;
    }
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

  const handleContext = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    if (e.target === stageRef.current || !contextRef.current || !stageRef.current) return;
    const targetBubble = e.target.parent;
    const stage = stageRef.current;
    const contextMenu = contextRef.current;
    const targetId = targetBubble?.getAttrs().id;
    if (!targetId) return;
    contextTargetId.current = targetId;
    contextMenu.style.display = "block";
    const containerRect = stage.container().getBoundingClientRect();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    contextMenu.style.top = containerRect.top + pointerPosition.y + 4 + "px";
    contextMenu.style.left = containerRect.left + pointerPosition.x + 4 + "px";
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={canvasSize.x}
        height={canvasSize.y}
        onContextMenu={handleContext}
        onWheel={handleZoom}
        draggable
      >
        <Layer
          ref={layerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {bubbles.map((elem) => (
            <Bubble
              key={elem.id}
              id={elem.id}
              text={elem.text}
              x={elem.x}
              y={elem.y}
              createdAt={elem.created_at}
              handleCursor={changeCursor}
            />
          ))}
        </Layer>
      </Stage>
      <div ref={contextRef} className="hidden absolute">
        <button
          className="px-6 py-2 rounded-md shadow-md bg-white hover:bg-neutral-200 dark:text-slate-600"
          onClick={removeBubble}
        >
          Delete
        </button>
      </div>
      <NewBubbleForm createBubble={createBubble} />
    </>
  );
}
