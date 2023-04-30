import kontra from "kontra";
import { SceneID } from "./constants";
import SpringClass from "../entities/spring";
import FanClass from "../entities/fan";
import DogClass from "../entities/dog";

const canvas = kontra.getCanvas();

const playgroundScene = kontra.Scene({
  id: SceneID.PLAYGROUND,
  onShow: function () {
    const spring = new SpringClass({
      x: canvas.width / 2 - 60,
      y: canvas.height / 2,
      triggerKey: "q",
    });

    const fan = new FanClass({
      x: canvas.width / 2,
      y: canvas.height / 2,
      triggerKey: "w",
    });

    const dog = new DogClass({
      x: canvas.width / 2 + 60,
      y: canvas.height / 2,
      triggerKey: "e",
    });

    this.add(spring);
    this.add(fan);
    this.add(dog);
  },
});

export default playgroundScene;
