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
      starting: {
        frames: "1..2",
        frameRate: 4,
      },
      firing: {
        frames: "3",
        frameRate: 1,
      },
      stopping: {
        frames: "4..6",
        frameRate: 4,
      },
    },
  });
});

export default class BollardClass extends ControlClass {
  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
      firingDuration: 200,
      reloadingDuration: 300,
      startingDuration: 25,
      stoppingDuration: 25,
      onReloading: function () {
        this.playAnimation("idle");
      },
      onReloaded: function () {
        this.playAnimation("idle");
      },
      onStarting: function () {
        this.playAnimation("starting");
      },
      onStopping: function () {
        this.playAnimation("stopping");
      },
      onFiring: function () {
        this.playAnimation("firing");
      },
    });
  }
}
