import { getCanvas, GameObjectClass, Scene, TileEngine } from "kontra";
import PostmanSprite from "./postman";

const TILE_SIZE = 32;
const TILE_ID_LEFT = 4;
const TILE_ID_RANDOM = 5;
const TILE_ID_RIGHT = 6;

export default class Spawner extends GameObjectClass {
  #spawned = 0;

  constructor(properties: any) {
    const { spawnEvery, factory, scene, elapsed, spawnMax, direction } =
      properties;
    super(properties);
    this.spawnEvery = spawnEvery;
    this.elapsed = elapsed || 0;
    this.factory = factory;
    this.scene = scene;
    this.spawnMax = spawnMax || 0;
    this.direction = direction == null ? 0.5 : direction;
  }
  update() {
    if (this.spawnMax !== 0 && this.#spawned >= this.spawnMax) {
      return;
    }

    this.elapsed += 1;

    if (this.elapsed >= this.spawnEvery) {
      const entities = this.factory(this);
      this.scene.add(...entities);
      this.elapsed = 0;
      this.#spawned += entities.length;
    }
  }
}

export function createAndAddSpawners(
  gameScene: Scene,
  tileEngine: TileEngine,
  postmanFactory: (sp: Spawner, tiles: TileEngine) => PostmanSprite[]
): Spawner[] {
  const canvasWidth = getCanvas().width;
  const result: Spawner[] = [];

  for (let x = TILE_SIZE / 2; x < canvasWidth; x += TILE_SIZE) {
    const tileId = tileEngine.tileAtLayer("world", { x, y: TILE_SIZE / 2 });
    const direction = getDirectionFromTileId(tileId);

    if (isNaN(direction)) {
      continue;
    }

    const spawner = new Spawner({
      spawnEvery: 120, // 60 frames is 1 second
      elapsed: 120,
      factory: (sp: Spawner) => postmanFactory(sp, tileEngine),
      scene: gameScene,
      x,
      y: 1.5 * TILE_SIZE,
      spawnMax: 0,
      direction: direction,
    });

    gameScene.add(spawner);
    result.push(spawner);
  }

  return result;
}

export function getDirectionFromTileId(tileId: number): number {
  switch (tileId) {
    case TILE_ID_LEFT:
      return 0;

    case TILE_ID_RANDOM:
      return 0.5;

    case TILE_ID_RIGHT:
      return 1;

    default:
      return NaN;
  }
}
