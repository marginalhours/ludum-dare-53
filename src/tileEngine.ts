import { imageAssets, TileEngine } from "kontra";
import { Position } from "./interfaces";
import tilesetJson from "./assets/data/tileset.json";
import tilesetSrc from "./assets/images/tileset-new.png";

export enum Tiles {
  Empty = 0,
  WallLeft = 15,
  WallRight = 16,
  Dog = 20,
}

let tileEngine: TileEngine;

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
