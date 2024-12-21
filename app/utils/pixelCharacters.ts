"use client";
export const pixelCharacters = [
  {
    name: "Zeus",
    sprite: `
      ....WWWW....
      ...WWWWWW...
      ..WWYYYYWW..
      ..WWYYWYWW..
      ..WWYYYYWW..
      ...WWWWWW...
      ....WGGW....
      ...WWGGWW...
      ..WWWGGWWW..
      .WWWWGGWWWW.
      .WWWWGGWWWW.
      ..WWWWWWWW..
      ...WW..WW...
      ...WW..WW...
      ..WWW..WWW..
      `,
  },
  {
    name: "Athena",
    sprite: `
      ....GGGG....
      ...GGGGGG...
      ..GGYYYYYY..
      ..GYYWYWWG..
      ..GYYYYYGG..
      ...GGGGGG...
      ....WBBW....
      ...WWBBWW...
      ..WWWBBWWW..
      .WWWWBBWWWW.
      .WWWWBBWWWW.
      ..WWWWWWWW..
      ...WW..WW...
      ...WW..WW...
      ..WWW..WWW..
      `,
  },
  {
    name: "Poseidon",
    sprite: `
      ....BBBB....
      ...BBBBBB...
      ..BBYYYYBB..
      ..BBYYWYWB..
      ..BBYYYYBB..
      ...BBBBBB...
      ....WCCW....
      ...WWCCWW...
      ..WWWCCWWW..
      .WWWWCCWWWW.
      .WWWWCCWWWW.
      ..WWWWWWWW..
      ...WW..WW...
      ...WW..WW...
      ..WWW..WWW..
      `,
  },
];

export function renderPixelArt(sprite: string): string[][] {
  return sprite
    .trim()
    .split("\n")
    .map((row) => row.split(""));
}
