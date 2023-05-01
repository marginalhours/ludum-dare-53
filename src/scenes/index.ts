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
import creditsScene from "./credits";
import completeScene from "./complete";

// Array of all the scenes
const sceneArray: Scene[] = [
  menuScene,
  playgroundScene,
  levelSelectScene,
  completeScene,
  instructionsScene,
  creditsScene,
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
