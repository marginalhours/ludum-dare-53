import kontra, { TileEngine } from "kontra";
const { SpriteClass, Pool } = kontra;

enum GibState {
  FLYING = "flying",
  LYING = "lying",
}

export default class GibSprite extends SpriteClass {
  init(props: any) {
    const { heading, tiles, speed } = props;

    const dy = speed * Math.cos(heading);
    const dx = speed * Math.sin(heading);
    this.tiles = tiles;
    this.gibState = GibState.FLYING;

    const gibColours = ["#e53b44", "#e4a672", "#ffe762", "#4f6781"];

    super.init({
      color: gibColours[Math.floor(Math.random() * gibColours.length)],
      width: 1 + 2 * Math.random(),
      height: 1 + 2 * Math.random(),
      dx,
      dy,
      ddy: 0.035,
      ...props,
    });
  }

  update() {
    super.update();
    if (this.isCollidingWithWorld()) {
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
    }
  }

  isCollidingWithWorld() {
    if (!this.tiles) {
      return false;
    }

    const positionAtBase = {
      x: this.x + this.width / 2,
      y: this.y + this.height,
    };

    const tileAtBase = (this.tiles as TileEngine).tileAtLayer(
      "world",
      positionAtBase
    );

    if (tileAtBase !== 0) {
      return true;
    }

    return false;
  }
}

export const GibPool = Pool({
  maxSize: 1024,
  create: () => {
    return new GibSprite({ heading: 0, speed: 0, tiles: null });
  },
});
