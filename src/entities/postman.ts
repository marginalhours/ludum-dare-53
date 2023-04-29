import kontra, { TileEngine } from "kontra";
const { SpriteSheet, imageAssets, SpriteClass } = kontra;

import { EventType } from "../constants";

import postie from "../assets/images/postie.png";

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
      walking: {
        frames: "0..7",
        frameRate: 12,
      },
    },
  });
});

const canvas = kontra.getCanvas();

export default class PostmanSprite extends SpriteClass {
  static SCALE_X = 1.5;
  static SCALE_Y = 1.5;

  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
    });
    this.anchor.x = 0.5;
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
        break;
      case PostmanState.WALKING_LEFT:
        this.y = this.y - ((this.y + this.height) % TILE_SIZE);
        this.dx = -1;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
        this.playAnimation("walking");
        this.direction = 0;
        break;
      case PostmanState.WALKING_RIGHT:
        this.y = this.y - ((this.y + this.height) % TILE_SIZE);
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
