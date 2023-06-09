import kontra from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";
import { startAssetLoading } from "../assetLoader";

const { Text, Sprite } = kontra;
const canvas = kontra.getCanvas();

const loadingBar = Sprite({
  x: 0,
  y: canvas.height / 2,
  anchor: { x: 0.0, y: 0.5 },
  width: 0,
  height: 20,
  color: "#55a",
  targetWidth: 0,
  update: function () {
    this.width = kontra.lerp(this.width as number, this.targetWidth, 0.5);
  },
});

let text = Text({
  text: "loading...",
  font: "16px monospace",
  color: "white",
  x: canvas.width / 2,
  y: canvas.height / 2,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
});

kontra.on(EventType.LOADING_PROGRESS, (fraction: number) => {
  loadingBar.targetWidth = fraction * canvas.width;
});

kontra.on(EventType.LOADING_COMPLETE, () => {
  setTimeout(() => kontra.emit(EventType.CHANGE_SCENE, getFirstSceneId()), 500);
  // setTimeout(
  //   () => kontra.emit(EventType.CHANGE_SCENE, SceneID.PLAYGROUND),
  //   500
  // );
});

function getFirstSceneId(): SceneID {
  const map: { [key: string]: SceneID } = {
    "?level-select": SceneID.LEVEL_SELECT,
    "?level-complete": SceneID.LEVEL_COMPLETE,
    "?playground": SceneID.PLAYGROUND,
    "?laser-overload": SceneID.LASER_OVERLOAD,
    "?loop-the-loop": SceneID.LOOP_THE_LOOP,
    "?nice-n-easy": SceneID.NICE_N_EASY,
    "?laser-focused": SceneID.LASER_FOCUSED,
    "?shish-kebob": SceneID.SHISH_KEBOB,
  };

  return map[location.search] || SceneID.MENU;
}

const loadingScene = kontra.Scene({
  id: SceneID.LOADING,
  onShow() {
    startAssetLoading();
  },
});

loadingScene.add(loadingBar);
loadingScene.add(text);

export default loadingScene;
