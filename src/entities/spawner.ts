import { GameObjectClass } from "kontra";
import { Tiles } from "../tileEngine";

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

export function getDirectionFromTileId(tileId: number): number {
  switch (tileId) {
    case Tiles.SpawnerLeft:
      return 0;

    case Tiles.SpawnerRandom:
      return 0.5;

    case Tiles.SpawnerRight:
      return 1;

    default:
      return NaN;
  }
}
