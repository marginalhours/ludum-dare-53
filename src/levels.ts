import laserOverloadJson from "./assets/data/LaserOverload.json";
import loopTheLoopJson from "./assets/data/LoopTheLoop.json";
import niceNEasyJson from "./assets/data/NiceNEasy.json";
import laserFocusedJson from "./assets/data/LaserFocused.json";
import shishKebobJson from "./assets/data/Shishkebob.json";
import { SceneID } from "./scenes/constants";

export const LEVEL_DATA: { [key: string]: any } = {
  [SceneID.LASER_OVERLOAD]: laserOverloadJson,
  [SceneID.LOOP_THE_LOOP]: loopTheLoopJson,
  [SceneID.NICE_N_EASY]: niceNEasyJson,
  [SceneID.LASER_FOCUSED]: laserFocusedJson,
  [SceneID.SHISH_KEBOB]: shishKebobJson,
};
