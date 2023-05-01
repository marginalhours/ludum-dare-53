import kontra, { SpriteClass, SpriteSheet, imageAssets } from "kontra";
import ControlClass from "./control";
import { EventType } from "../constants";
import { playLaser } from "../soundManager";

import laser from "../assets/images/laser.png";
import { addEntity, removeEntity } from "./entityManager";

const canvas = kontra.getCanvas();

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

export class LaserBeamClass extends SpriteClass {}

const BeamFactory = (props: any) => {
  const { x, y, width } = props;
  return new LaserBeamClass({
    x,
    y,
    color: "#e561e5",
    height: 2,
    width,
  });
};

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
        removeEntity(this.parent, this.leftBeam);
        removeEntity(this.parent, this.rightBeam);

        this.playAnimation("stopping");
        this.currentAnimation.reset();
      },
      onFiring: function () {
        playLaser();
        this.leftBeam = BeamFactory({ x: 0, y: this.y + 5, width: this.x });
        this.rightBeam = BeamFactory({
          x: this.x + 32,
          y: this.y + 5,
          width: canvas.width - this.x,
        });
        addEntity(this.parent, this.leftBeam);
        addEntity(this.parent, this.rightBeam);
        this.playAnimation("firing");
        this.currentAnimation.reset();
      },
    });
  }
}
