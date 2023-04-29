import kontra, { TileEngine } from "kontra";
const { SpriteSheet, imageAssets, SpriteClass } = kontra;

import { EventType } from "../constants";

import postie from "../assets/images/postie.png";
import { GibPool } from "./gib";

let spriteSheet: any;

const TILE_SIZE = 32;

enum PostmanState {
  FALLING = "falling",
  WALKING_LEFT = "walkingLeft",
  WALKING_RIGHT = "walkingRight",
  DEAD = "dead",
}

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[postie],
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      falling: {
        frames: "0..1",
        frameRate: 4,
      },
      walking: {
        frames: "2..9",
        frameRate: 12,
      },
    },
  });
});

const canvas = kontra.getCanvas();

export default class PostmanSprite extends SpriteClass {
  static SCALE_X = 2;
  static SCALE_Y = this.SCALE_X;

  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
    });
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.direction = props.direction == null ? 0 : props.direction; // 0 = left, 1 = right
    this.setScale(PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
    this.changeState(PostmanState.FALLING);
  }

  onDown() {
    this.murder();
  }

  changeState(nextState: PostmanState) {
    if (nextState == this.state) {
      return;
    }

    switch (nextState) {
      case PostmanState.FALLING:
        this.ddy = 0.1;
        this.dx = 0;
        this.playAnimation("falling");
        break;
      case PostmanState.WALKING_LEFT:
        this.y = this.y - (this.y % TILE_SIZE);
        this.dx = -1;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
        this.playAnimation("walking");
        this.direction = 0;
        break;
      case PostmanState.WALKING_RIGHT:
        this.y = this.y - (this.y % TILE_SIZE);
        this.dx = 1;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(-1 * PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
        this.playAnimation("walking");
        this.direction = 1;
        break;
    }

    this.state = nextState;
  }

  isCollidingWithWorld() {
    const tileAtBase = (this.tiles as TileEngine).tileAtLayer("world", this);

    if (tileAtBase !== 0) {
      return true;
    }

    return false;
  }

  update() {
    super.update();

    if (this.x < -this.width || this.x > canvas.width) {
      this.x = (this.x + canvas.width) % canvas.width;
    }

    if (this.isCollidingWithWorld()) {
      if (this.state == PostmanState.FALLING) {
        this.changeState(
          this.direction === 0
            ? PostmanState.WALKING_LEFT
            : PostmanState.WALKING_RIGHT
        );
      }
    } else {
      this.changeState(PostmanState.FALLING);
    }
  }
}

export const gibPostman = (man: PostmanSprite, tileEngine: TileEngine) => {
  const gibCount = 48;
  return Array.from(Array(gibCount).keys())
    .map((_) => {
      const arcSize = Math.PI;
      const heading = Math.PI + (0.5 * arcSize - arcSize * Math.random());
      const speed = 1 + 2.5 * Math.random();

      const gib = GibPool.get({
        x: man.x,
        y: man.y,
        heading: heading,
        speed: speed,
        tiles: tileEngine,
        ttl: 150,
      });

      return gib;
    })
    .filter((gib) => gib !== undefined);
};
