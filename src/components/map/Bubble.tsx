import { Group, Rect, Text } from "react-konva";

type BubbleProps = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export default function Bubble({ id, text, x, y }: BubbleProps) {
  return (
    <Group id={id} x={x} y={y} draggable>
      <Rect cornerRadius={10} width={260} height={100} fill="blue" />
      <Rect cornerRadius={10} x={-3} y={-3} width={266} height={106} name="barrier" />
      <Text text={`${text}\n\nx:${x} y:${y}`} fill="white" width={260} height={100} align="center" padding={5} />
    </Group>
  );
}
