import { Scene } from "kontra";

import menuScene from "./menu";
import playgroundScene from "./playground";

import laserOverloadScene from "./laserOverload";
import loopTheLoopScene from "./loopTheLoop";
import niceNEasyScene from "./niceNEasy";
import niceNNastyScene from "./niceNNasty";
import shishKebobScene from "./shishKebobScene";
import levelSelectScene from "./levelSelect";

// Array of all the scenes
const sceneArray: Scene[] = [
  menuScene,
  playgroundScene,
  levelSelectScene,
  // levels (x5)
  laserOverloadScene,
  loopTheLoopScene,
  niceNEasyScene,
  niceNNastyScene,
  shishKebobScene,
];

// Dictionary of scene ID to Scene
export const allScenes: Record<string, Scene> = sceneArray.reduce(
  (scenes, scene) => ({ ...scenes, [scene.id]: scene }),
  {}
);
