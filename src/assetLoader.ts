/*
 * This file stitches together the howlerjs and kontra loading systems
 * to handle audio and image loading respectively
 */
import kontra from "kontra";
import { Howl } from "howler";
import { registerSound, SoundType } from "./soundManager";
import { EventType } from "./constants";

// Audio imports
import boingSrc from "./assets/sounds/boing.ogg";
import dog1Src from "./assets/sounds/dog1.mp3";
import dog2Src from "./assets/sounds/dog2.mp3";
import dog3Src from "./assets/sounds/dog3.mp3";

// Image imports
import tilesetSrc from "./assets/images/tileset-new.png";
import postieSrc from "./assets/images/postie.png";
import goodPostieSrc from "./assets/images/good-postie.png";
import spikesSrc from "./assets/images/spikes.png";
import dogSrc from "./assets/images/dog.png";
import springSrc from "./assets/images/spring.png";
import fanSrc from "./assets/images/fan-2.png";
import squashSrc from "./assets/images/squasher.png";
import bollardSrc from "./assets/images/bollard.png";

// Audio
const audioFiles = [
  [SoundType.Boing, boingSrc],
  [SoundType.Dog1, dog1Src],
  [SoundType.Dog2, dog2Src],
  [SoundType.Dog3, dog3Src],
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
