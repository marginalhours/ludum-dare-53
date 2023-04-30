import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import dog from "../assets/images/dog.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[dog],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      fired: {
        frames: "1..6",
        frameRate: 12,
      },
    },
  });
});

export default class DogClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      duration: 200,
      cooldown: 300,
      onReady: function () {
        this.playAnimation("idle");
      },
      onFinished: function () {
        this.playAnimation("idle");
      },
      onFire: function () {
        this.playAnimation("fired");
      },
    });
  }
}
