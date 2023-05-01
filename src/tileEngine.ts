import { imageAssets, TileEngine } from "kontra";
import { Position } from "./interfaces";
import tilesetSrc from "./assets/images/tileset.png";

import { SceneID } from "./scenes/constants";
import { LEVEL_DATA } from "./levels";

export const TILE_SIZE = 32;

export enum Tiles {
  Empty = 0,
  PlatformLeft = 1,
  PlatformMiddle = 2,
  PlatformRight = 3,
  SpawnerLeft = 4,
  SpawnerRandom = 5,
  SpawnerRight = 6,
  Fan = 7,
  Squasher = 8,
  Spikes = 9,
  Spring = 10,
  Bollard = 11,
  Ground = 12,
  Laser = 13,
  SpikesDown = 14,
  WallLeft = 15,
  WallRight = 16,
  TrapDoor = 18,
  Dog = 20,
  Barbecue = 32,
  RoofLeft = 89,
  RoofRight = 90,
  HouseLeft = 99,
  HouseRight = 100,
}

let tileEngine: TileEngine;

export function forEachTile(
  handler: (position: Position, tile: number) => void
): void {
  for (let y = 0; y < tileEngine.mapheight; y += TILE_SIZE) {
    for (let x = 0; x < tileEngine.mapwidth; x += TILE_SIZE) {
      const position: Position = { x, y };
      const tile = getTileAtPosition(position);
      handler(position, tile);
    }
  }
}

export function initialiseTileEngine(sceneId: SceneID): TileEngine {
  const properties = LEVEL_DATA[sceneId] as any;
  properties.tilesets[0].image = imageAssets[tilesetSrc];
  tileEngine = TileEngine(properties);
  return tileEngine;
}

export function getTileAtPosition(position: Position): number {
  return tileEngine.tileAtLayer("world", position);
}

export function isTileAtPosition(position: Position): boolean {
  return getTileAtPosition(position) !== Tiles.Empty;
}

export function isTileFloor(tile: number): boolean {
  return [
    Tiles.PlatformLeft,
    Tiles.PlatformMiddle,
    Tiles.PlatformRight,
    Tiles.Ground,
  ].includes(tile);
}

export function isTileWall(tile: number): boolean {
  return [Tiles.WallLeft, Tiles.WallRight].includes(tile);
}

export function isTileFloorOrWall(tile: number): boolean {
  return isTileFloor(tile) || isTileWall(tile);
}

export function isTileFloorOrWallAtPosition(position: Position) {
  return isTileFloorOrWall(getTileAtPosition(position));
}
