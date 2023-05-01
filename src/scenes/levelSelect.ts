import kontra, { Grid } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";

const { ButtonClass } = kontra;
const canvas = kontra.getCanvas();

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
      text: `1.${index + 1} ${levelName}`,
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
        this.textNode.color = "#fff";
      }
    },
  });
};

const levelSelectScene = kontra.Scene({
  id: SceneID.LEVEL_SELECT,
  onShow() {
    const levelButtonData = [
      { name: "laser overload", sceneId: SceneID.LASER_OVERLOAD },
      { name: "loop the loop", sceneId: SceneID.LOOP_THE_LOOP },
      { name: "nice'n'easy", sceneId: SceneID.NICE_N_EASY },
      { name: "nice'n'nasty", sceneId: SceneID.NICE_N_NASTY },
      { name: "shish kebob", sceneId: SceneID.SHISH_KEBOB },
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
      y: canvas.height / 2,
      anchor: { x: 0.5, y: 0.5 },

      // add 15 pixels of space between each row
      rowGap: 15,

      // center the children
      justify: "center",

      children: levelButtons,
    });

    levelButtons.map((button) => kontra.track(button));
    this.add(menu);
  },
});

export default levelSelectScene;
