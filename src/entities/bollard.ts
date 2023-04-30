import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import bollard from "../assets/images/bollard.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[bollard],
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

export default class BollardClass extends ControlClass {
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
