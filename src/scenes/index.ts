import { Scene } from "kontra";

import menuScene from "./menu";
import playgroundScene from "./playground";

import laserOverloadScene from "./laserOverload";
import loopTheLoopScene from "./loopTheLoop";
import niceNEasyScene from "./niceNEasy";
import laserFocusedScene from "./laserFocused";
import shishKebobScene from "./shishKebobScene";
import levelSelectScene from "./levelSelect";
import instructionsScene from "./instructions";

// Array of all the scenes
const sceneArray: Scene[] = [
  menuScene,
  playgroundScene,
  levelSelectScene,
  instructionsScene,
  // levels (x5)
  laserOverloadScene,
  loopTheLoopScene,
  niceNEasyScene,
  laserFocusedScene,
  shishKebobScene,
];

// Dictionary of scene ID to Scene
export const allScenes: Record<string, Scene> = sceneArray.reduce(
  (scenes, scene) => ({ ...scenes, [scene.id]: scene }),
  {}
);
