import { Stage, Text } from '@pixi/react';

export const SecondPage = () => {
  return (
    <Stage width={800} height={600} options={{ background: 0x1099bb }}>
      <Text
        text="Welcome to the Second Page!"
        anchor={0.5}
        x={400}
        y={300}
        style={{
          fill: '0xffffff',
          fontSize: 36,
        }}
      />
    </Stage>
  );
};