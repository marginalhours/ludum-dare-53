import kontra, { Grid, imageAssets, Sprite } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";
import backgroundSrc from "./../assets/images/level-select.png";
import HoverableButton from "../entities/hoverableButton";

const { ButtonClass } = kontra;
const canvas = kontra.getCanvas();

let backButton = new HoverableButton({
  text: {
    color: "black",
    font: "20px monospace",
    background: "#f00",
    text: "🠔 BACK",
    anchor: { x: 0.55, y: 0.5 },
  },
  anchor: { x: 0.5, y: 0.5 },
  x: canvas.width / 2,
  y: 720,
  onDown() {
    (this.y as number) += 1;
  },
  onUp() {
    (this.y as number) -= 1;

    setTimeout(() => kontra.emit(EventType.CHANGE_SCENE, SceneID.MENU), 50);
  },
  onOver() {
    canvas.style.cursor = "pointer";
  },
  onOut() {
    canvas.style.cursor = "auto";
  },
  render() {
    this.draw();

    if (this.pressed) {
      this.textNode.color = "#000";
    } else if (this.focused || this.hovered) {
      this.textNode.color = "#333";
    } else {
      this.textNode.color = "#000";
    }
  },
});

kontra.track(backButton);

const noop = () => {};

interface LevelSelectButtonProps {
  onOver: () => void;
  onOut: () => void;
  props: any;
}

class LevelSelectButtonClass extends ButtonClass {
  init({ onOver, onOut, ...props }: LevelSelectButtonProps) {
    this._oo = onOver || noop;
    this._ooo = onOut || noop;
    super.init(props);
  }

  onOver() {
    this._oo();
    super.onOver();
  }

  onOut() {
    this._ooo();
    super.onOut();
  }
}

const levelSelectButtonFactory = ({ levelName, levelId, index }: any) => {
  return new LevelSelectButtonClass({
    text: {
      color: "#fff",
      font: "20px monospace",
      text: `1-${index + 1} ${levelName}`,
    },
    onDown() {
      (this.y as number) += 1;
    },
    onUp() {
      (this.y as number) -= 1;
      setTimeout(() => kontra.emit(EventType.CHANGE_SCENE, levelId), 50);
    },
    onOver() {
      canvas.style.cursor = "pointer";
    },
    onOut() {
      canvas.style.cursor = "auto";
    },
    render() {
      this.draw();

      if (this.pressed) {
        this.textNode.color = "#aaa";
      } else if (this.focused || this.hovered) {
        this.textNode.color = "#f00";
      } else {
        this.textNode.color = "#000";
      }
    },
  });
};

const levelSelectScene = kontra.Scene({
  id: SceneID.LEVEL_SELECT,
  onShow() {
    const background = Sprite({
      width: canvas.width,
      height: canvas.height,
      image: imageAssets[backgroundSrc],
    });

    this.add(background);

    const levelButtonData = [
      { name: "NICE 'N' EASY", sceneId: SceneID.NICE_N_EASY },
      { name: "LASER FOCUSED", sceneId: SceneID.LASER_FOCUSED },
      { name: "LOOP THE LOOP", sceneId: SceneID.LOOP_THE_LOOP },
      { name: "LASER OVERLOAD", sceneId: SceneID.LASER_OVERLOAD },
      { name: "SHISH KEBOB", sceneId: SceneID.SHISH_KEBOB },
    ];

    const levelButtons = levelButtonData.map(({ name, sceneId }, index) =>
      levelSelectButtonFactory({
        levelName: name,
        levelId: sceneId,
        index: index,
      })
    );

    let menu = Grid({
      x: canvas.width / 2,
      y: 595,
      anchor: { x: 0.5, y: 0.5 },
      rowGap: 15,
      justify: "start",

      children: levelButtons,
    });

    levelButtons.map((button) => kontra.track(button));
    this.add(menu);
    this.add(backButton);
  },
});

export default levelSelectScene;
