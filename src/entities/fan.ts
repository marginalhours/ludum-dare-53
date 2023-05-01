import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import fan from "../assets/images/fan-2.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[fan],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      firing: {
        frames: "1..8",
        frameRate: 12,
      },
    },
  });
});

export default class FanClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      firingDuration: 300,
      loadingDuration: 100,
      onReloaded: function () {
        this.playAnimation("idle");
      },
      onReloading: function () {
        this.playAnimation("idle");
      },
      onFiring: function () {
        this.playAnimation("firing");
      },
    });
  }
}
