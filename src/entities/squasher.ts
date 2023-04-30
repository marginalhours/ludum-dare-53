import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import squasher from "../assets/images/squasher.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[squasher],
    frameWidth: 32,
    frameHeight: 64,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      firing: {
        frames: "1..6",
        frameRate: 6,
      },
    },
  });
});

export default class SquasherClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      firingDuration: 60,
      reloadingDuration: 100,
      onReloaded: function () {
        this.playAnimation("idle");
      },
      onReloading: function () {
        this.playAnimation("idle");
      },
      onFiring: function () {
        this.playAnimation("firing");
      },
      onStopping: function () {
        this.playAnimation("idle");
      },
    });
  }
}
