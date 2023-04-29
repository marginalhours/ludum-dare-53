import kontra from "kontra";
import { EventType } from "../constants";
const canvas = kontra.getCanvas();
import { SceneID } from "./constants";

import tilesetSrc from "./../assets/images/tileset.png";
// Not using Kontra's asset loading here because Vite inlines the JSON.
import tilesetJson from "./../assets/data/tileset.json";

import PostmanSprite from "../entities/postman";
import Spawner from "../entities/spawner";
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

const gameScene = kontra.Scene({
  id: SceneID.GAME,
  onShow() {
    gameScene.add(GibPool);
    winButton.focus();
    // Add tile engine
    (tilesetJson as any).tilesets[0].source = null;
    (tilesetJson as any).tilesets[0].image = kontra.imageAssets[tilesetSrc];
    const tileEngine = kontra.TileEngine(tilesetJson);
    this.add(tileEngine);

    function getRandomDirection(spawnerDirection: number): number {
      if (spawnerDirection === 0) {
        return 0;
      }

      if (spawnerDirection === 1) {
        return 1;
      }

      return Math.random() < spawnerDirection ? 0 : 1;
    }

    const gibFactory = (man: PostmanSprite) => {
      const gibCount = 48;
      return Array.from(Array(gibCount).keys())
        .map((_) => {
          const arcSize = 0.4;
          const heading = Math.PI + (0.5 * arcSize - arcSize * Math.random());
          const speed = 1 + 1.5 * Math.random();

          const gib = GibPool.get({
            x: man.x,
            y: man.y,
            heading: heading,
            speed: speed,
            tiles: tileEngine,
            ttl: 150,
          });

          return gib;
        })
        .filter((gib) => gib !== undefined);
    };

    const postmanFactory = (sp: Spawner) => {
      let man = new PostmanSprite({
        x: sp.x,
        y: sp.y,
        ddy: 0.1,
        tiles: tileEngine,
        direction: getRandomDirection(sp.direction),
        murder: () => {
          const gibs = gibFactory(man);
          gameScene.add(...gibs);
          gameScene.remove(man);
        },
      });
      kontra.track(man);
      return [man];
    };

    const leftSpawner = new Spawner({
      spawnEvery: 120, // 60 frames is 1 second
      elapsed: 120,
      factory: postmanFactory,
      scene: gameScene,
      x: 5.5 * 32,
      y: 1 * 32,
      //spawnMax: 0,
      direction: 1,
    });

    const rightSpawner = new Spawner({
      spawnEvery: 120, // 60 frames is 1 second
      elapsed: 120,
      factory: postmanFactory,
      scene: gameScene,
      x: 11.5 * 32,
      y: 1 * 32,
      //spawnMax: 1,
      direction: 0,
    });

    this.add(leftSpawner);
    this.add(rightSpawner);
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
