import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import barbecue from "../assets/images/barbecue.png";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[barbecue],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      starting: {
        frames: "1..3",
        frameRate: 3,
      },
      firing: {
        frames: "4..6",
        frameRate: 6,
      },
      stopping: {
        frames: "2..0",
        frameRate: 3,
      },
    },
  });
});

export default class BarbecueClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      startingDuration: 50,
      stoppingDuration: 50,
      firingDuration: 150,
      reloadingDuration: 100,
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
      onReloaded: function () {
        this.playAnimation("idle");
        this.currentAnimation.reset();
      },
      onReloading: function () {
        this.playAnimation("idle");
        this.currentAnimation.reset();
      },
    });
  }
}
