import { useState } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";

type BubbleProps = {
  id: string;
  text: string;
  x: number;
  y: number;
  createdAt: string;
};

export default function Bubble({ id, text, x, y, createdAt }: BubbleProps) {
  const [stroke, setStroke] = useState("");

  const handleMouseEnter = () => {
    setStroke("#007ecc");
  };

  const handleMouseLeave = () => {
    setStroke("");
  };

  return (
    <Group id={id} x={x} y={y} draggable>
      <Rect
        cornerRadius={16}
        width={260}
        height={130}
        fillRadialGradientStartPoint={{ x: 100, y: -50 }}
        fillRadialGradientStartRadius={10}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={270}
        fillRadialGradientColorStops={[0, "#ca74ff", 1, "#00b3ef"]}
      />
      {/* <Rect cornerRadius={10} x={-3} y={-3} width={266} height={106} onClick={test} name="barrier" /> */}
      <Circle x={20} y={110} radius={8} stroke="white" />
      <Line points={[20, 106, 20, 110, 24, 112]} strokeWidth={2} lineCap="round" stroke="white" />
      <Text text={text} width={260} height={100} padding={10} fontSize={16} align="center" fill="white" />
      <Text text={createdAt} x={35} y={105} fill="white" />
      <Rect
        cornerRadius={16}
        width={260}
        height={130}
        strokeWidth={3}
        stroke={stroke}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </Group>
  );
}
