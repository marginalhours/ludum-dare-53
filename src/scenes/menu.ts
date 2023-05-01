import kontra, { Sprite } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";

const { ButtonClass, imageAssets } = kontra;
const canvas = kontra.getCanvas();

import title from "../assets/images/title-screen.png";

const noop = () => {};

interface HoverableButtonProps {
  onOver: () => void;
  onOut: () => void;
  props: any;
}

class HoverableButton extends ButtonClass {
  init({ onOver, onOut, ...props }: HoverableButtonProps) {
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

let startButton = new HoverableButton({
  text: {
    color: "black",
    font: "16px monospace",
    background: "#f00",
    text: "start game",
    anchor: { x: 0.5, y: 0.5 },
  },
  anchor: { x: 0.5, y: 0.5 },
  x: canvas.width / 2,
  y: 640,
  onDown() {
    (this.y as number) += 1;
  },
  onUp() {
    (this.y as number) -= 1;

    setTimeout(
      () => kontra.emit(EventType.CHANGE_SCENE, SceneID.LEVEL_SELECT),
      50
    );
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
      this.textNode.color = "#000";
    } else {
      this.textNode.color = "#000";
    }
  },
});

kontra.track(startButton);

const menuScene = kontra.Scene({
  id: SceneID.MENU,
  onShow() {
    const titleScreen = Sprite({
      x: 0,
      y: 0,
      image: imageAssets[title],
    });
    startButton.focus();

    this.add(titleScreen);
    this.add(startButton);
  },
  focus() {
    startButton.focus();
  },
});

export default menuScene;
