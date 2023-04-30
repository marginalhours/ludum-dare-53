import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import trapdoor from "../assets/images/trapdoor.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[trapdoor],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      firing: {
        frames: "7",
        frameRate: 1,
      },
      starting: {
        frames: "1..6",
        frameRate: 6,
      },
      stopping: {
        frames: "6..0",
        frameRate: 7,
      },
    },
  });
});

export default class TrapdoorClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      firingDuration: 200,
      reloadingDuration: 100,
      startingDuration: 50,
      stoppingDuration: 50,

      onReloaded: function () {
        this.playAnimation("idle");
        this.currentAnimation.reset();
      },
      onReloading: function () {
        this.playAnimation("idle");
        this.currentAnimation.reset();
      },
      onFiring: function () {
        this.playAnimation("firing");
        this.currentAnimation.reset();
      },
      onStarting: function () {
        this.playAnimation("starting");
        this.currentAnimation.reset();
      },
      onStopping: function () {
        this.playAnimation("stopping");
        this.currentAnimation.reset();
      },
    });
  }
}
