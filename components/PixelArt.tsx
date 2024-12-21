"use client";

interface PixelArtProps {
  sprite: string[][];
  scale?: number;
}

const colorMap: { [key: string]: string } = {
  'W': 'bg-white',
  'Y': 'bg-yellow-300',
  'G': 'bg-gray-500',
  'B': 'bg-blue-500',
  'C': 'bg-cyan-300',
  'R': 'bg-red-500',
};

export const PixelArt: React.FC<PixelArtProps> = ({ sprite, scale = 1 }) => {
  return (
    <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${sprite[0].length}, 1fr)` }}>
      {sprite.map((row, i) =>
        row.map((pixel, j) => (
          <div
            key={`${i}-${j}`}
            className={`${colorMap[pixel] || 'bg-transparent'} border border-black/10`}
            style={{ width: `${scale}px`, height: `${scale}px` }}
          />
        ))
      )}
    </div>
  );
};

