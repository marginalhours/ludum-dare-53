import { getCanvas, imageAssets, TileEngine } from "kontra";
import { Position } from "./interfaces";
import tilesetJson from "./assets/data/tileset.json";
import tilesetSrc from "./assets/images/tileset-new.png";

export const TILE_SIZE = 32;

export enum Tiles {
  Empty = 0,
  SpawnerLeft = 4,
  SpawnerRandom = 5,
  SpawnerRight = 6,
  WallLeft = 15,
  WallRight = 16,
  Dog = 20,
}

let tileEngine: TileEngine;

export function forEachTile(
  handler: (x: number, y: number, tile: number) => void
): void {
  const canvas = getCanvas();

  for (let y = 0; y < canvas.height; y += TILE_SIZE) {
    for (let x = 0; x < canvas.width; x += TILE_SIZE) {
      const tile = getTileAtPosition({ x, y });
      handler(x, y, tile);
    }
  }
}

export function initialiseTileEngine(): TileEngine {
  const properties = tilesetJson as any;
  properties.tilesets[0].image = imageAssets[tilesetSrc];
  tileEngine = TileEngine(tilesetJson);
  return tileEngine;
}

export function getTileAtPosition(position: Position): number {
  return tileEngine.tileAtLayer("world", position);
}

export function isTileAtPosition(position: Position): boolean {
  return getTileAtPosition(position) !== Tiles.Empty;
}

export function isTileWall(tile: number): boolean {
  switch (tile) {
    case Tiles.WallLeft:
    case Tiles.WallRight:
      return true;

    default:
      return false;
  }
}
