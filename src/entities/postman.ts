import kontra, { TileEngine } from "kontra";
const { SpriteSheet, imageAssets, SpriteClass } = kontra;

import { EventType } from "../constants";

import ghostie from "../assets/images/ghostie.png";

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
    image: imageAssets[ghostie],
    frameWidth: 16,
    frameHeight: 24,
    animations: {
      right: {
        frames: [0, 1, 2, 1],
        frameRate: 12,
      },
      left: {
        frames: [3, 4, 5, 4],
        frameRate: 12,
      },
    },
  });
});

const canvas = kontra.getCanvas();

export default class PostmanSprite extends SpriteClass {
  init(props: any) {
    super.init({ ...props, animations: spriteSheet.animations });
    this.changeState(PostmanState.FALLING);
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
        // this.y = this.y - (this.y % TILE_SIZE) + 1;
        this.dx = -1;
        this.ddy = 0;
        this.dy = 0;
        this.playAnimation("left");
        break;
      case PostmanState.WALKING_RIGHT:
        // this.y = this.y - (this.y % TILE_SIZE) + 1;
        this.dx = 1;
        this.ddy = 0;
        this.dy = 0;
        this.playAnimation("right");
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
          Math.random() < 0.5
            ? PostmanState.WALKING_LEFT
            : PostmanState.WALKING_RIGHT
        );
      }
    } else {
      this.changeState(PostmanState.FALLING);
    }
  }
}
