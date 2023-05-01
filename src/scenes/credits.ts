import kontra, { Sprite } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";

const { imageAssets } = kontra;
const canvas = kontra.getCanvas();

import credits from "../assets/images/credits.png";
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
      this.textNode.color = "#aaa";
    } else if (this.focused || this.hovered) {
      this.textNode.color = "#f00";
    } else {
      this.textNode.color = "#fff";
    }
  },
});

kontra.track(backButton);

const creditsScene = kontra.Scene({
  id: SceneID.CREDITS,
  onShow() {
    const creditsBackground = Sprite({
      x: 0,
      y: 0,
      image: imageAssets[credits],
    });
    backButton.focus();

    this.add(creditsBackground);
    this.add(backButton);
  },
  focus() {
    backButton.focus();
  },
});

export default creditsScene;
