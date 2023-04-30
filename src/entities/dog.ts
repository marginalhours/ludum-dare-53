import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";
import { playDog } from "../soundManager";

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
      firingDuration: 200,
      reloadingDuration: 300,
      onReloaded: function () {
        this.playAnimation("idle");
      },
      onReloading: function () {
        this.playAnimation("idle");
      },
      onFiring: function () {
        this.playAnimation("fired");
        playDog();
      },
    });
  }
}
