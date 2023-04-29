import kontra from "kontra";
import { EventType } from "../constants";
const canvas = kontra.getCanvas();
import { SceneID } from "./constants";

import tilesetSrc from "./../assets/images/tileset.png";
// Not using Kontra's asset loading here because Vite inlines the JSON.
import tilesetJson from "./../assets/data/tileset.json";

import PostmanSprite from "../entities/postman";
import PlatformSprite from "../entities/platform";
import Spawner from "../entities/spawner";

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

const platforms = Array.from(Array(5).keys()).map((idx) => {
  const width = Math.random() * canvas.width * 0.75;
  const fraction = 64 + (idx / 5) * canvas.height;

  return new PlatformSprite({
    x: Math.random() * (canvas.width - width),
    y: fraction,
    width: width,
  });
});

const gameScene = kontra.Scene({
  id: SceneID.GAME,
  onShow() {
    winButton.focus();
    const postmanFactory = (sp) => {
      let man = new PostmanSprite({
        x: sp.x,
        y: 0,
        ddy: 0.1,
        platforms: platforms,
      });

      return [man];
    };

    const spawner = new Spawner({
      spawnEvery: 60, // 60 frames is 1 second
      factory: postmanFactory,
      scene: gameScene,
      x: canvas.width / 2,
    });

    this.add(spawner);

    // Add tile engine
    (tilesetJson as any).tilesets[0].source = null;
    (tilesetJson as any).tilesets[0].image = kontra.imageAssets[tilesetSrc];
    const tileEngine = kontra.TileEngine(tilesetJson);
    this.add(tileEngine);
  },
  onHide() {
    this.remove(...men);
  },
  focus() {
    winButton.focus();
  },
});

gameScene.add(winButton);
gameScene.add(...platforms);

export default gameScene;
