import kontra from "kontra";
import { SceneID } from "./constants";
import PostmanSprite, { gibPostman } from "../entities/postman";
import Spawner from "../entities/spawner";
import { GibPool } from "../entities/gib";
import { initialiseTileEngine } from "../tileEngine";
import { addEntitiesToGame } from "../entities/entityManager";

const postmanFactory = (sp: Spawner) => {
  let man = new PostmanSprite({
    x: sp.x,
    y: sp.y,
    ddy: 0.1,
    direction: () => sp.getRandomDirection(),
    murder: () => {
      gibPostman(man);
      sp.scene.remove(man);
    },
  });
  kontra.track(man);
  return [man];
};

let men: PostmanSprite[] = [];

const niceNEasyScene = kontra.Scene({
  id: SceneID.NICE_N_EASY,

  onShow() {
    this.add(GibPool);

    this.add(initialiseTileEngine(this.id as SceneID));

    addEntitiesToGame(this, postmanFactory);
  },

  onHide() {
    this.remove(...men);
    men = [];
  },
});

export default niceNEasyScene;