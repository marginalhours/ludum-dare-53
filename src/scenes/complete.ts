import kontra, { Sprite, Text } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";

const { imageAssets } = kontra;
const canvas = kontra.getCanvas();

import complete from "../assets/images/levelComplete.png";
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

const completeScene = kontra.Scene({
  id: SceneID.LEVEL_COMPLETE,
  onShow() {
    const completeBackground = Sprite({
      x: 0,
      y: 0,
      image: imageAssets[complete],
    });
    backButton.focus();

    //@ts-ignore
    const scoreValue = window.__LAST_LEVEL_SCORE || 0;
    //@ts-ignore
    const scoreFraction = window.__LAST_LEVEL_FRACTION;

    const scoreLabelText = Text({
      text: `${scoreValue}`,
      font: "48px monospace",
      color: "white",
      anchor: { x: 0.5, y: 0.5 },
      x: 136,
      y: 400,
      opacity: 0,
      update() {
        //@ts-ignore
        this.opacity += 0.01;
      },
    });

    const fracToRank = (frac: number) => {
      if (frac > 0.9) {
        return "S";
      } else if (frac > 0.8) {
        return "A";
      } else if (frac > 0.7) {
        return "B";
      } else if (frac > 0.6) {
        return "C";
      } else {
        return "D";
      }
    };

    const rankLabelText = Text({
      text: fracToRank(scoreFraction),
      font: "48px monospace",
      color: "white",
      anchor: { x: 0.5, y: 0.5 },
      x: 410,
      y: 400,
      opacity: 0,
      delay: 60,
      update() {
        if (this.delay > 0) {
          this.delay -= 1;
        } else {
          //@ts-ignore
          this.opacity += 0.01;
        }
      },
    });

    this.add(completeBackground);
    this.add(scoreLabelText);
    this.add(rankLabelText);
    this.add(backButton);
  },
  focus() {
    backButton.focus();
  },
});

export default completeScene;
