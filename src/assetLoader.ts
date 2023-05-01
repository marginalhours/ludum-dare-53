/*
 * This file stitches together the howlerjs and kontra loading systems
 * to handle audio and image loading respectively
 */
import kontra from "kontra";
import { Howl } from "howler";
import { registerSound, SoundType } from "./soundManager";
import { EventType } from "./constants";

// Audio imports
import boingSrc from "./assets/sounds/boing.mp3";
import dog1Src from "./assets/sounds/dog1.mp3";
import dog2Src from "./assets/sounds/dog2.mp3";
import dog3Src from "./assets/sounds/dog3.mp3";
import gib1Src from "./assets/sounds/gib1.mp3";
import gib2Src from "./assets/sounds/gib2.mp3";
import gib3Src from "./assets/sounds/gib3.mp3";
import laser1Src from "./assets/sounds/laser1.mp3";
import laser2Src from "./assets/sounds/laser2.mp3";
import laser3Src from "./assets/sounds/laser3.mp3";
import spikes1Src from "./assets/sounds/spikes1.mp3";
import spikes2Src from "./assets/sounds/spikes2.mp3";
import spikes3Src from "./assets/sounds/spikes3.mp3";
import trapdoor1Src from "./assets/sounds/trapdoor.mp3";
import fan1Src from "./assets/sounds/fan1.mp3";
import fan2Src from "./assets/sounds/fan2.mp3";

// Image imports
import tilesetSrc from "./assets/images/tileset.png";
import postieSrc from "./assets/images/postie.png";
import goodPostieSrc from "./assets/images/good-postie.png";
import spikesSrc from "./assets/images/spikes.png";
import dogSrc from "./assets/images/dog.png";
import springSrc from "./assets/images/spring.png";
import fanSrc from "./assets/images/fan-2.png";
import squashSrc from "./assets/images/squasher.png";
import bollardSrc from "./assets/images/bollard.png";
import barbecueSrc from "./assets/images/barbecue.png";
import houseSrc from "./assets/images/house.png";
import laserSrc from "./assets/images/laser.png";
import trapdoorSrc from "./assets/images/trapdoor.png";
import teleporterSrc from "./assets/images/teleporter.png";
import frameSrc from "./assets/images/frame.png";
import titleSrc from "./assets/images/title-screen.png";
import postieHeadSrc from "./assets/images/postie-head.png";
import levelSelectSrc from "./assets/images/level-select.png";
import instructionsSrc from "./assets/images/instructions.png";
import creditsSrc from "./assets/images/credits.png";
import completeSrc from "./assets/images/levelComplete.png";

// Audio
const audioFiles = [
  [SoundType.Boing, boingSrc],
  [SoundType.Dog1, dog1Src],
  [SoundType.Dog2, dog2Src],
  [SoundType.Dog3, dog3Src],
  [SoundType.Gib1, gib1Src],
  [SoundType.Gib2, gib2Src],
  [SoundType.Gib3, gib3Src],
  [SoundType.Laser1, laser1Src],
  [SoundType.Laser2, laser2Src],
  [SoundType.Laser3, laser3Src],
  [SoundType.Spikes1, spikes1Src],
  [SoundType.Spikes2, spikes2Src],
  [SoundType.Spikes3, spikes3Src],
  [SoundType.Trapdoor1, trapdoor1Src],
  [SoundType.Fan1, fan1Src],
  [SoundType.Fan2, fan2Src],
];

// Images
const imageFiles = [
  tilesetSrc,
  postieSrc,
  goodPostieSrc,
  spikesSrc,
  dogSrc,
  springSrc,
  fanSrc,
  squashSrc,
  bollardSrc,
  barbecueSrc,
  houseSrc,
  laserSrc,
  trapdoorSrc,
  teleporterSrc,
  frameSrc,
  titleSrc,
  postieHeadSrc,
  levelSelectSrc,
  instructionsSrc,
  creditsSrc,
  completeSrc,
];

// Percentage tracking
const assetsToLoadCount = audioFiles.length + imageFiles.length;
let loadedAssetsCount = 0;

// Used via kontra/howl to report loading progress
const loadingProgressCallback = (kind: string, path: string) => {
  kontra.emit(EventType.SINGLE_ASSET_LOADED, kind, path);

  loadedAssetsCount += 1;

  kontra.emit(
    EventType.LOADING_PROGRESS,
    loadedAssetsCount / assetsToLoadCount
  );

  if (loadedAssetsCount === assetsToLoadCount) {
    kontra.emit(EventType.LOADING_COMPLETE);
  }
};

kontra.on(EventType._KONTRA_ASSET_LOADED, loadingProgressCallback);

export const startAssetLoading = () => {
  // Audio file loading via howl
  audioFiles.map(([name, source]) => {
    registerSound(
      name,
      new Howl({
        src: [source],
        autoplay: false,
        loop: false,
        rate: 1.0,
        volume: 0.25,
        onload: () => loadingProgressCallback("sound", source),
      })
    );
  });

  // Image file loading via kontra
  kontra.load(...imageFiles);
};
