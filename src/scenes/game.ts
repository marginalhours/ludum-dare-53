import kontra from "kontra";
import { SceneID } from "./constants";
import PostmanSprite, { gibPostman } from "../entities/postman";
import Spawner from "../entities/spawner";
import { GibPool } from "../entities/gib";
import { initialiseTileEngine } from "../tileEngine";
import { addEntitiesToGame } from "../entities/entityManager";

let men: PostmanSprite[] = [];

const getRandomDirection = (spawnerDirection: number): number => {
  if ([0, 1].includes(spawnerDirection)) {
    return spawnerDirection;
  }
  return Math.random() < spawnerDirection ? 0 : 1;
};

const postmanFactory = (sp: Spawner) => {
  let man = new PostmanSprite({
    x: sp.x,
    y: sp.y,
    ddy: 0.1,
    direction: getRandomDirection(sp.direction),
    murder: () => {
      gibPostman(man);
      sp.scene.remove(man);
    },
  });
  kontra.track(man);
  return [man];
};

const gameScene = kontra.Scene({
  id: SceneID.GAME,

  onShow() {
    this.add(GibPool);

    this.add(initialiseTileEngine());

    addEntitiesToGame(this, postmanFactory);
  },

  onHide() {
    this.remove(...men);
    men = [];
  },
});

export default gameScene;
