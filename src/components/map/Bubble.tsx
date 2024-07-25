import { Group, Rect, Text } from "react-konva";

type BubbleProps = {
  text: string;
  x: number;
  y: number;
};

export default function Bubble({ text, x, y }: BubbleProps) {
  return (
    <Group draggable>
      <Rect
        cornerRadius={10}
        x={x}
        y={y}
        width={100}
        height={100}
        fill="blue"
      />
      <Rect
        cornerRadius={10}
        x={x - 3}
        y={y - 3}
        width={106}
        height={106}
        name="barrier"
      />
      <Text
        text={text}
        fill="white"
        x={x}
        y={y}
        width={100}
        height={100}
        align="center"
        padding={5}
      />
    </Group>
  );
}
