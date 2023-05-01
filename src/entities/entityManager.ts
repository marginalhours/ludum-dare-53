import kontra, { track, untrack } from "kontra";
import { TILE_SIZE, Tiles, forEachTile } from "../tileEngine";
import Spawner, { getDirectionFromTileId } from "./spawner";
import DogClass from "./dog";
import { Position } from "../interfaces";
import SpringClass from "./spring";
import BollardClass from "./bollard";
import TrapdoorClass from "./trapdoor";
import SpikesClass from "./spikes";
import BarbecueClass from "./barbecue";
import FanClass from "./fan";
import SquasherClass from "./squasher";
import LaserClass from "./laser";
import HouseSpriteClass from "./house";

const TRIGGER_KEYS = "1234567890qwertyuiopasdfghjklzxcvbnm".split("");
let triggerKeyIndex = 0;

function getTriggerKey() {
  return TRIGGER_KEYS[triggerKeyIndex++ % TRIGGER_KEYS.length];
}

export let entities: any[] = [];

export function addEntitiesToScene(gameScene: any, postmanFactory: any) {
  // Add sprites based on tiles.
  forEachTile((position, tile) => {
    const entity = createEntity(position, tile, gameScene, postmanFactory);

    if (entity != null) {
      if (entity.constructor === Spawner) {
        gameScene.spawners = [...(gameScene.spawners || []), entity];
      }

      gameScene.add(entity);
      track(entity);
      entities.push(entity);
    }
  });
}

export function addEntity(gameScene: any, entity: any) {
  gameScene.add(entity);
  track(entity);
  entities.push(entity);
}

export function removeEntity(gameScene: any, entity: any) {
  gameScene.remove(entity);
  untrack(entity);
  entities = entities.filter((x) => x !== entity);
}

export function resetEntities() {
  entities.map((entity) => kontra.untrack(entity));
  entities = [];
}

export function getEntities() {
  return entities;
}

function createEntity(
  position: Position,
  tile: number,
  gameScene: any,
  postmanFactory: any
): any {
  const { x, y } = position;

  switch (tile) {
    case Tiles.Bollard:
      return new BollardClass({
        x,
        y: y - 14,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Dog:
      return new DogClass({ x, y, triggerKey: getTriggerKey() });

    case Tiles.SpawnerLeft:
    case Tiles.SpawnerRandom:
    case Tiles.SpawnerRight:
      return createSpawner(position, tile, gameScene, postmanFactory);

    case Tiles.Spring:
      return new SpringClass({
        x,
        y: y - 12,
        triggerKey: getTriggerKey(),
      });

    case Tiles.TrapDoor:
      return new TrapdoorClass({
        x,
        y: y - 16,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Spikes:
      return new SpikesClass({
        x,
        y: y - 16,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Barbecue:
      return new BarbecueClass({
        x,
        y: y - 14,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Fan:
      return new FanClass({
        x,
        y: y - 16,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Squasher:
      return new SquasherClass({
        x,
        y: y,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Laser:
      return new LaserClass({
        x,
        y: y - 14,
        triggerKey: getTriggerKey(),
      });

    case Tiles.Door:
      return new HouseSpriteClass({
        x,
        y: y - 32,
      });
  }
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

  console.log(direction);

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
