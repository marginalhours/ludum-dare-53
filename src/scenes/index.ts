import { Scene } from "kontra";

import menuScene from "./menu";
import gameScene from "./game";
import playgroundScene from "./playground";

// Array of all the scenes
const sceneArray: Scene[] = [menuScene, gameScene, playgroundScene];

// Dictionary of scene ID to Scene
export const allScenes: Record<string, Scene> = sceneArray.reduce(
  (scenes, scene) => ({ ...scenes, [scene.id]: scene }),
  {}
);
