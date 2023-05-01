import kontra, { Sprite } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";

const { imageAssets } = kontra;
const canvas = kontra.getCanvas();

import instructions from "../assets/images/instructions.png";
import HoverableButton from "../entities/hoverableButton";

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
  y: 700,
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

const menuScene = kontra.Scene({
  id: SceneID.INSTRUCTIONS,
  onShow() {
    const instructionsBackground = Sprite({
      x: 0,
      y: 0,
      image: imageAssets[instructions],
    });
    backButton.focus();

    this.add(instructionsBackground);
    this.add(backButton);
  },
  focus() {
    backButton.focus();
  },
});

export default menuScene;
