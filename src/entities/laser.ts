import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import laser from "../assets/images/laser.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[laser],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      starting: {
        frames: "3",
        frameRate: 1,
      },
      firing: {
        frames: "4",
        frameRate: 1,
      },
      stopping: {
        frames: "5",
        frameRate: 1,
      },
    },
  });
});

export default class LaserClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      firingDuration: 200,
      reloadingDuration: 300,
      startingDuration: 0,
      stoppingDuration: 0,
      onReloading: function () {
        this.playAnimation("idle");
        this.currentAnimation.reset();
      },
      onReloaded: function () {
        this.playAnimation("idle");
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
      onFiring: function () {
        this.playAnimation("firing");
        this.currentAnimation.reset();
      },
    });
  }
}
