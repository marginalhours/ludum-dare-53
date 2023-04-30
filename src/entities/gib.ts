import kontra from "kontra";
import { isTileFloorOrWallAtPosition } from "../tileEngine";
const { SpriteClass, Pool, PoolClass } = kontra;

enum GibState {
  FLYING = "flying",
  LYING = "lying",
}

export default class GibSprite extends SpriteClass {
  init(props: any) {
    const { heading, speed } = props;

    const dy = speed * Math.cos(heading);
    const dx = speed * Math.sin(heading);
    const ddy = 0.15;
    this.state = GibState.FLYING;

    // TODO: If you gib a good postie, he should have a different palette
    const gibColours = ["#e53b44", "#e4a672", "#ffe762", "#4f6781"];

    super.init({
      ...props,
      color: gibColours[Math.floor(Math.random() * gibColours.length)],
      width: 1 + 2 * Math.random(),
      height: 1 + 2 * Math.random(),
      dx,
      dy,
      ddy,
      anchor: { x: 0.5, y: 0.5 },
    });
  }

  update() {
    super.update();

    if (isTileFloorOrWallAtPosition(this)) {
      this.changeState(GibState.LYING);
    }
  }

  changeState(nextState: GibState) {
    if (nextState === this.state) {
      return;
    }

    switch (nextState) {
      case GibState.LYING:
        this.dy = 0;
        this.dx = 0;
        this.ddy = 0;
        break;
    }

    this.state = nextState;
  }
}

//@ts-ignore
export const GibPool: DimensionPool = Pool({
  maxSize: 1024,
  create: () => {
    return new GibSprite({ heading: 0, speed: 0, tiles: null });
  },
});

class DimensionPool extends PoolClass {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(props: any) {
    super(props);
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;
  }
}

// Important - give the pool fake dimensions
// so that the culling of the game doesn't make it not get rendered

GibPool.x = 0;
GibPool.y = 0;
GibPool.width = 1;
GibPool.height = 1;
