import kontra from "kontra";
const { SpriteSheet, imageAssets, SpriteClass, collides } = kontra;

import { EventType } from "../constants";

import postie from "../assets/images/postie.png";

let spriteSheet: any;

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
    super.init({ ...props, animations: spriteSheet.animations });
    this.anchor.x = 0.5;
    this.setScale(PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
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
        this.dx = -1;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
        this.playAnimation("walking");
        break;
      case PostmanState.WALKING_RIGHT:
        this.dx = 1;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(-1 * PostmanSprite.SCALE_X, PostmanSprite.SCALE_Y);
        this.playAnimation("walking");
        break;
    }

    this.state = nextState;
  }

  update() {
    super.update();

    if (this.x < -this.width || this.x > canvas.width) {
      this.x = (this.x + canvas.width) % canvas.width;
    }

    if (
      (this.platforms as any[]).some((platform) => collides(platform, this))
    ) {
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
