import kontra from "kontra";
const { GameObjectClass } = kontra;

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
    this.spawnMax = spawnMax || 1;
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
