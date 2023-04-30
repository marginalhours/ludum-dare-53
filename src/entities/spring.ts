import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import spring from "../assets/images/spring.png";
import { SoundType, playSound } from "../soundManager";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[spring],
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

export default class SpringClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      duration: 100,
      cooldown: 100,
      onReady: function () {
        this.playAnimation("idle");
      },
      onFinished: function () {
        this.playAnimation("idle");
      },
      onFire: function () {
        this.playAnimation("fired");
        playSound(SoundType.Boing);
      },
    });
  }
}
