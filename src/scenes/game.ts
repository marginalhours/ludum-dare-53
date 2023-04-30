import kontra from "kontra";
import { EventType } from "../constants";
const canvas = kontra.getCanvas();
import { SceneID } from "./constants";
import PostmanSprite, { gibPostman } from "../entities/postman";
import Spawner, { createAndAddSpawners } from "../entities/spawner";
import { GibPool } from "../entities/gib";
import { initialiseTileEngine } from "../tileEngine";

let winButton = kontra.Button({
  text: {
    color: "red",
    font: "16px monospace",
    text: "win game",
    anchor: { x: 0.5, y: 0.5 },
  },
  anchor: { x: 0.5, y: 0.5 },
  x: canvas.width / 2,
  y: canvas.height / 2,
  onDown() {
    (this.y as number) += 1;
  },
  onUp() {
    (this.y as number) -= 1;
    setTimeout(() => kontra.emit(EventType.CHANGE_SCENE, SceneID.MENU), 50);
  },
  render() {
    this.draw();

    if (this.pressed) {
      this.textNode.color = "#aaa";
    } else if (this.focused || this.hovered) {
      this.textNode.color = "#ccc";
    } else {
      this.textNode.color = "#fff";
    }
  },
});

kontra.track(winButton);

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

    winButton.focus();

    this.add(initialiseTileEngine());

    createAndAddSpawners(this as any as kontra.Scene, postmanFactory);
  },
  onHide() {
    this.remove(...men);
  },
  focus() {
    winButton.focus();
  },
});

gameScene.add(winButton);

export default gameScene;
