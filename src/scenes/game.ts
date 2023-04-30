import kontra, { TileEngine } from "kontra";
import { EventType } from "../constants";
const canvas = kontra.getCanvas();
import { SceneID } from "./constants";

import tilesetSrc from "./../assets/images/tileset-new.png";
const TILE_SIZE = 32;

// Not using Kontra's asset loading here because Vite inlines the JSON.
import tilesetJson from "./../assets/data/tileset.json";

import PostmanSprite, { gibPostman } from "../entities/postman";
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

// Loops over the top row of tiles and adds spawners where necessary.
function createAndAddSpawners(
  gameScene: kontra.Scene,
  tileEngine: TileEngine,
  postmanFactory: (sp: Spawner, tiles: TileEngine) => PostmanSprite[]
): Spawner[] {
  const SPAWNER_TILE_ID = 72;

  const result: Spawner[] = [];

  for (let x = TILE_SIZE / 2; x < canvas.width; x += TILE_SIZE) {
    const tileId = tileEngine.tileAtLayer("world", { x, y: TILE_SIZE / 2 });

    if (tileId !== SPAWNER_TILE_ID) {
      continue;
    }

    const spawner = new Spawner({
      spawnEvery: 120, // 60 frames is 1 second
      elapsed: 120,
      factory: (sp: Spawner) => postmanFactory(sp, tileEngine),
      scene: gameScene,
      x,
      y: 1.5 * TILE_SIZE,
      spawnMax: 0,
      direction: 0.5, // TODO: Determine spawner direction based on tile ID
    });

    gameScene.add(spawner);
    result.push(spawner);
  }

  return result;
}

const gameScene = kontra.Scene({
  id: SceneID.GAME,
  onShow() {
    this.add(GibPool);

    winButton.focus();
    // Add tile engine
    (tilesetJson as any).tilesets[0].source = null;
    (tilesetJson as any).tilesets[0].image = kontra.imageAssets[tilesetSrc];
    console.log(tilesetJson);
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
