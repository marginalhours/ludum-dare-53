import { track } from "kontra";
import { TILE_SIZE, Tiles, forEachTile } from "../tileEngine";
import Spawner, { getDirectionFromTileId } from "./spawner";
import DogClass from "./dog";
import { Position } from "../interfaces";

export const entities: any[] = [];

export function addEntitiesToGame(gameScene: any, postmanFactory: any) {
  // Add sprites based on tiles.
  forEachTile((position, tile) => {
    const entity = createEntity(position, tile, gameScene, postmanFactory);

    if (entity != null) {
      gameScene.add(entity);
      track(entity);
      entities.push(entity);
    }
  });
}

function createEntity(
  position: Position,
  tile: number,
  gameScene: any,
  postmanFactory: any
): any {
  switch (tile) {
    case Tiles.SpawnerLeft:
    case Tiles.SpawnerRandom:
    case Tiles.SpawnerRight:
      return createSpawner(position, tile, gameScene, postmanFactory);

    case Tiles.Dog:
      return createDog(position);
  }
}

function createDog({ x, y }: Position) {
  return new DogClass({ x, y, triggerKey: "d" });
}

function createSpawner(
  { x, y }: Position,
  tile: number,
  gameScene: any,
  postmanFactory: any
): Spawner | null {
  const direction = getDirectionFromTileId(tile);

  if (isNaN(direction)) {
    return null;
  }

  return new Spawner({
    spawnEvery: 120, // 60 frames is 1 second
    elapsed: 120,
    factory: (sp: Spawner) => postmanFactory(sp),
    scene: gameScene,
    x: x + 0.5 * TILE_SIZE,
    y: y + 1.5 * TILE_SIZE,
    spawnMax: 0,
    direction: direction,
  });
}
