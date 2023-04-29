import kontra from "kontra";
const { GameObjectClass } = kontra;

export default class Spawner extends GameObjectClass {
  constructor(properties: any) {
    const { spawnEvery, factory, scene, elapsed } = properties;
    super(properties);
    this.spawnEvery = spawnEvery;
    this.elapsed = elapsed || 0;
    this.factory = factory;
    this.scene = scene;
  }
  update() {
    this.elapsed += 1;
    if (this.elapsed >= this.spawnEvery) {
      const entities = this.factory(this);
      this.scene.add(...entities);

      this.elapsed = 0;
    }
  }
}
