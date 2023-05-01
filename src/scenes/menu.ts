import kontra, { Grid, Sprite } from "kontra";
import { SceneID } from "./constants";
import { EventType } from "../constants";

const { imageAssets } = kontra;
const canvas = kontra.getCanvas();

import title from "../assets/images/title-screen.png";
import HoverableButton from "../entities/hoverableButton";

const menuButtonFactory = (text: string, onUp: any) => {
  return new HoverableButton({
    text: {
      color: "black",
      font: "20px monospace",
      background: "#f00",
      text: text,
      anchor: { x: 0.55, y: 0.5 },
    },
    anchor: { x: 0.5, y: 0.5 },
    x: canvas.width / 2,
    onDown() {
      (this.y as number) += 1;
    },
    onUp() {
      (this.y as number) -= 1;

      onUp();
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
};

const startButton = menuButtonFactory("START GAME", () => {
  setTimeout(
    () => kontra.emit(EventType.CHANGE_SCENE, SceneID.LEVEL_SELECT),
    50
  );
});

const instructionsButton = menuButtonFactory("INSTRUCTIONS", () => {
  setTimeout(
    () => kontra.emit(EventType.CHANGE_SCENE, SceneID.INSTRUCTIONS),
    50
  );
});

const creditsButton = menuButtonFactory("CREDITS", () => {
  setTimeout(() => kontra.emit(EventType.CHANGE_SCENE, SceneID.CREDITS), 50);
});

kontra.track(startButton);
kontra.track(instructionsButton);

const menuScene = kontra.Scene({
  id: SceneID.MENU,
  onShow() {
    const titleScreen = Sprite({
      x: 0,
      y: 0,
      image: imageAssets[title],
    });
    startButton.focus();

    let startMenu = Grid({
      x: canvas.width / 2,
      y: 660,
      anchor: { x: 0.5, y: 0.5 },
      rowGap: 15,
      justify: "center",

      children: [startButton, instructionsButton, creditsButton],
    });

    this.add(titleScreen);
    this.add(startMenu);
  },
  focus() {
    startButton.focus();
  },
});

export default menuScene;
