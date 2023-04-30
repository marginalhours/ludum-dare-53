import kontra from "kontra";
import { SceneID } from "./constants";
import SpringClass from "../entities/spring";
import FanClass from "../entities/fan";
import DogClass from "../entities/dog";
import SquasherClass from "../entities/squasher";
import BollardClass from "../entities/bollard";
import TrapdoorClass from "../entities/trapdoor";
import SpikesClass from "../entities/spikes";
import BarbecueClass from "../entities/barbecue";

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

    const squasher = new SquasherClass({
      x: canvas.width / 2 + 120,
      y: canvas.height / 2,
      triggerKey: "r",
    });

    const bollard = new BollardClass({
      x: canvas.width / 2 + 180,
      y: canvas.height / 2,
      triggerKey: "t",
    });

    const trapdoor = new TrapdoorClass({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      triggerKey: "a",
    });

    const spikes = new SpikesClass({
      x: canvas.width / 2 + 60,
      y: canvas.height / 2 + 100,
      triggerKey: "s",
    });

    const barbecue = new BarbecueClass({
      x: canvas.width / 2 + 60,
      y: canvas.height / 2 + 100,
      triggerKey: "d",
    });

    this.add(spring);
    this.add(fan);
    this.add(dog);
    this.add(squasher);
    this.add(bollard);
    this.add(trapdoor);
    this.add(spikes);
    this.add(barbecue);

    // Make sure to track controls via kontra.track() to get mouse events
    kontra.track(spring);
    kontra.track(fan);
    kontra.track(dog);
    kontra.track(squasher);
    kontra.track(bollard);
    kontra.track(trapdoor);
    kontra.track(spikes);
    kontra.track(barbecue);
  },
});

export default playgroundScene;
