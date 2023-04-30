import kontra from "kontra";
import { EventType } from "../constants";
const canvas = kontra.getCanvas();
import { SceneID } from "./constants";
import PostmanSprite, { gibPostman } from "../entities/postman";
import Spawner, { getDirectionFromTileId } from "../entities/spawner";
import { GibPool } from "../entities/gib";
import {
  TILE_SIZE,
  Tiles,
  forEachTile,
  initialiseTileEngine,
} from "../tileEngine";

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

    // Add sprites based on tiles.
    forEachTile((x, y, tile) => {
      switch (tile) {
        case Tiles.SpawnerLeft:
        case Tiles.SpawnerRandom:
        case Tiles.SpawnerRight:
          const direction = getDirectionFromTileId(tile);

          if (isNaN(direction)) {
            return;
          }

          const spawner = new Spawner({
            spawnEvery: 120, // 60 frames is 1 second
            elapsed: 120,
            factory: (sp: Spawner) => postmanFactory(sp),
            scene: gameScene,
            x: x + 0.5 * TILE_SIZE,
            y: y + 1.5 * TILE_SIZE,
            spawnMax: 0,
            direction: direction,
          });

          gameScene.add(spawner);
          break;
      }
    });
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
