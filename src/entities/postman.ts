import kontra from "kontra";
const { SpriteSheet, imageAssets, SpriteClass } = kontra;

import { EventType } from "../constants";

import postie from "../assets/images/postie.png";
import { GibPool } from "./gib";
import { Tiles, getTileAtPosition, isTileWall } from "../tileEngine";

let spriteSheet: any;

const TILE_SIZE = 32;
const DIRECTION_LEFT = 0;
const DIRECTION_RIGHT = 1;

enum PostmanState {
  FALLING = "falling",
  WALKING_LEFT = "walkingLeft",
  WALKING_RIGHT = "walkingRight",
  DEAD = "dead",
}

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[postie],
    frameWidth: 32,
    frameHeight: 32,
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
  static WALKING_SPEED = 1;

  state: PostmanState = PostmanState.FALLING;

  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
    });
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.direction = props.direction == null ? DIRECTION_LEFT : props.direction;
  }

  onDown() {
    this.murder();
  }

  changeState(nextState: PostmanState) {
    if (nextState === this.state) {
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
        this.dx = -PostmanSprite.WALKING_SPEED;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(1, 1);
        this.playAnimation("walking");
        this.direction = DIRECTION_LEFT;
        break;

      case PostmanState.WALKING_RIGHT:
        this.y = this.y - (this.y % TILE_SIZE);
        this.dx = PostmanSprite.WALKING_SPEED;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(-1, 1);
        this.playAnimation("walking");
        this.direction = DIRECTION_RIGHT;
        break;
    }

    this.state = nextState;
  }

  // If walking, will change direction.
  changeDirection(): void {
    switch (this.state) {
      case PostmanState.WALKING_LEFT:
        this.changeState(PostmanState.WALKING_RIGHT);
        break;

      case PostmanState.WALKING_RIGHT:
        this.changeState(PostmanState.WALKING_LEFT);
        break;
    }
  }

  getTileAhead(): number {
    const lookAhead = 10;

    switch (this.state) {
      case PostmanState.WALKING_LEFT:
      case PostmanState.WALKING_RIGHT:
        const x =
          this.x +
          (this.state === PostmanState.WALKING_LEFT ? -1 : 1) * lookAhead;
        return getTileAtPosition({ x, y: this.y - 10 });

      default:
        return NaN;
    }
  }

  update() {
    super.update();

    if (this.x < 0) {
      if (this.state === PostmanState.WALKING_LEFT && this.x < -this.width) {
        this.x = canvas.width + this.width;
      }

      return;
    }

    if (this.x >= canvas.width) {
      if (
        this.state === PostmanState.WALKING_RIGHT &&
        this.x >= canvas.width + this.width
      ) {
        this.x = 0 - this.width;
      }

      return;
    }

    const tileAtFeet = getTileAtPosition(this);

    if (tileAtFeet !== Tiles.Empty) {
      if (this.state === PostmanState.FALLING) {
        this.changeState(
          this.direction === DIRECTION_LEFT
            ? PostmanState.WALKING_LEFT
            : PostmanState.WALKING_RIGHT
        );
      }
    } else {
      this.changeState(PostmanState.FALLING);
    }

    const tileAhead = this.getTileAhead();

    if (isTileWall(tileAhead)) {
      this.changeDirection();
    }
  }
}

export const gibPostman = (man: PostmanSprite) => {
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
        ttl: 150,
      });

      return gib;
    })
    .filter((gib) => gib !== undefined);
};
