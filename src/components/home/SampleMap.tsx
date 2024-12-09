"use client";

import { useState, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import Bubble from "@/components/map/Bubble";
import type { KonvaEventObject } from "konva/lib/Node";

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

const getDistance = (p1: Coords, p2: Coords) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const getCenter = (p1: Coords, p2: Coords) => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

const sampleBubbles = [
  {
    id: "1",
    text: "Stuff to do tomorrow",
    x: 180,
    y: 80,
    created_at: "2024-12-03T16:30:02.643519+00",
    parent_node: null,
    child_nodes: ["2", "3"],
  },
  {
    id: "2",
    text: "Call Sally at 11am",
    x: 250,
    y: 320,
    created_at: "2024-12-03T16:30:02.643519+00",
    parent_node: "1",
    child_nodes: [],
  },
  {
    id: "3",
    text: "Finish chemistry homework by noon",
    x: 510,
    y: 150,
    created_at: "2024-12-03T16:30:02.643519+00",
    parent_node: "1",
    child_nodes: [],
  },
];

export default function SampleMap() {
  const stageRef = useRef<null | Konva.Stage>(null);
  const layerRef = useRef<null | Konva.Layer>(null);
  const dragStopped = useRef(false);
  const lastDist = useRef(0);
  const lastCenter = useRef<null | Coords>(null);
  const [canvasSize, setCanvasSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const [edges, setEdges] = useState<EdgeProps[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ x: window.innerWidth, y: window.innerHeight });
    };

    const initialEdges = initEdges(sampleBubbles);
    setEdges(initialEdges);

    if (stageRef.current) {
      const stage = stageRef.current;
      if (window.innerWidth < 550) {
        stage.scale({ x: 0.7, y: 0.7 });
        stage.offsetX(170);
      } else if (window.innerWidth < 768) {
        stage.scale({ x: 0.8, y: 0.8 });
        stage.offsetX(50);
      }
    }

    window.addEventListener("resize", handleResize);
    Konva.hitOnDragEnabled = true;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

  const handleMouseDown = () => {
    changeCursor("grab");
  };

  const handleMouseUp = () => {
    changeCursor("release");
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const target = e.target as Konva.Group;
    target.setZIndex(sampleBubbles.length + edges.length - 1);

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
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    changeCursor("release");
  };

  const handleMouseZoom = (e: KonvaEventObject<WheelEvent>) => {
    const deltaY = e.evt.deltaY;
    const currentScale = e.currentTarget.scale();
    if (!currentScale) return;
    if (deltaY < 0 && currentScale.x + 0.1 <= 1) {
      e.currentTarget.scale({ x: (currentScale.x += 0.1), y: (currentScale.y += 0.1) });
    }
    if (deltaY > 0 && currentScale.x - 0.1 > 0.6) {
      e.currentTarget.scale({ x: (currentScale.x -= 0.1), y: (currentScale.y -= 0.1) });
    }
  };

  const handleTouchZoom = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && !touch2 && !stage.isDragging() && dragStopped.current) {
      stage.startDrag();
      dragStopped.current = false;
    }
    if (touch1 && touch2) {
      if (stage.isDragging()) {
        dragStopped.current = true;
        stage.stopDrag();
      }

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter.current) {
        lastCenter.current = getCenter(p1, p2);
        return;
      }

      const newCenter = getCenter(p1, p2);
      const dist = getDistance(p1, p2);

      if (!lastDist.current) {
        lastDist.current = dist;
      }

      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      const scale = stage.scaleX() * (dist / lastDist.current);
      if (scale < 1 && scale > 0.6) {
        stage.scale({ x: scale, y: scale });
        stage.scaleX(scale);
        stage.scaleY(scale);

        const dx = newCenter.x - lastCenter.current.x;
        const dy = newCenter.y - lastCenter.current.y;

        const newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);

        lastDist.current = dist;
        lastCenter.current = newCenter;
      }
    }
  };

  const handleTouchEnd = () => {
    lastDist.current = 0;
    lastCenter.current = null;
  };

  return (
    <div className="lg:w-[950px] h-[400px] lg:h-[570px] rounded-3xl shadow-[0_0_60px_-15px_rgba(56,13,103,0.15)] overflow-hidden">
      <Stage
        ref={stageRef}
        width={canvasSize.x}
        height={canvasSize.y}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchZoom}
        onWheel={handleMouseZoom}
        draggable
      >
        <Layer
          ref={layerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {sampleBubbles.map((elem) => (
            <Bubble
              key={elem.id}
              id={elem.id}
              text={elem.text}
              x={elem.x}
              y={elem.y}
              createdAt={elem.created_at}
              parentNode={elem.parent_node}
              handleCursor={changeCursor}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
