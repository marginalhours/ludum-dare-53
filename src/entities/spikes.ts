import kontra, { SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";

import spikes from "../assets/images/spikes.png";
import { playSpikes } from "../soundManager";

let spriteSheet: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[spikes],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: "0",
        frameRate: 1,
      },
      starting: {
        frames: "1..3",
        frameRate: 6,
      },
      firing: {
        frames: "3",
        frameRate: 1,
      },
      stopping: {
        frames: "4..6",
        frameRate: 6,
      },
    },
  });
});

export default class SpikesClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      startingDuration: 10,
      stoppingDuration: 25,
      firingDuration: 50,
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
        playSpikes();
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
