import kontra, { Grid, SpriteClass, imageAssets, Text, Sprite } from "kontra";
import { EventType } from "../constants";

import postieHead from "../assets/images/postie-head.png";

let headSprite: any;

kontra.on(EventType.LOADING_COMPLETE, () => {
  headSprite = new SpriteClass({
    image: imageAssets[postieHead],
  });
});

const guiFactory = ({ initialRemaining = 0 }) => {
  let remaining = initialRemaining;
  let scoreAmount = 0;

  const remainingText = Text({
    text: `${remaining}`,
    font: "32px monospace",
    color: "white",
  });

  const scoreLabelText = Text({
    text: "SCORE",
    font: "14px monospace",
    color: "white",
  });

  const scoreText = Text({
    text: "0",
    font: "16px monospace",
    color: "white",
    alignSelf: "end",
    width: 200,
  });

  const zapperLabelText = Text({
    text: "ZAPPER",
    font: "14px monospace",
    color: "white",
  });

  const zapperBar = Sprite({
    color: "rgba(127, 255, 127, 1.0)",
    height: 14,
    width: 100,
  });

  const remainingRow = Grid({
    remaining: remaining,
    anchor: { x: 0.5, y: 0.5 },
    colGap: 15,
    flow: "row",
    justify: "start",
    align: "start",
    alignSelf: "start",
    children: [headSprite, remainingText],
  });

  const scoreRow = Grid({
    remaining: remaining,
    anchor: { x: 0.5, y: 0.5 },
    colGap: 15,
    flow: "row",
    justify: "center",
    align: "center",
    children: [scoreLabelText, scoreText],
  });

  const zapRow = Grid({
    remaining: remaining,
    anchor: { x: 0.5, y: 0.5 },
    colGap: 15,
    flow: "row",
    justify: "center",
    align: "center",
    children: [zapperLabelText, zapperBar],
  });

  const gui = Grid({
    x: 16,
    y: 16,
    anchor: { x: 0.0, y: 0.0 },

    // add 15 pixels of space between each row
    rowGap: 15,

    // center the children
    justify: "start",
    align: "center",

    children: [zapRow, remainingRow, scoreRow],

    setRemaining(value: number) {
      remaining = value;
      remainingText.text = `${remaining}`;
    },

    setScore(value: number) {
      scoreAmount = value;
      scoreText.text = `${scoreAmount}`;
    },

    setZapperCharge(value: number) {
      zapperBar.width = value;
      if (value == 100) {
        zapperBar.color = "rgba(127, 255, 127, 1.0)";
      } else {
        zapperBar.color = "rgba(255, 255, 255, 1.0)";
      }
    },
  });

  return gui;
};

export default guiFactory;
