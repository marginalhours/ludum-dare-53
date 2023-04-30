import kontra, { TileEngine } from "kontra";
import { EventType } from "../constants";
const canvas = kontra.getCanvas();
import { SceneID } from "./constants";

import tilesetSrc from "./../assets/images/tileset.png";
// Not using Kontra's asset loading here because Vite inlines the JSON.
import tilesetJson from "./../assets/data/tileset.json";

import PostmanSprite, { gibPostman } from "../entities/postman";
import Spawner, { createAndAddSpawners } from "../entities/spawner";
import { GibPool } from "../entities/gib";

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

const postmanFactory = (sp: Spawner, tiles: TileEngine) => {
  let man = new PostmanSprite({
    x: sp.x,
    y: sp.y,
    ddy: 0.1,
    tiles,
    direction: getRandomDirection(sp.direction),
    murder: () => {
      gibPostman(man, tiles);
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
    // Add tile engine
    (tilesetJson as any).tilesets[0].source = null;
    (tilesetJson as any).tilesets[0].image = kontra.imageAssets[tilesetSrc];
    const tileEngine = kontra.TileEngine(tilesetJson);
    this.add(tileEngine);

    createAndAddSpawners(
      this as any as kontra.Scene,
      tileEngine,
      postmanFactory
    );
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
