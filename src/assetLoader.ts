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

// Image imports
import tilesetSrc from "./assets/images/tileset.png";
import postieSrc from "./assets/images/postie.png";
import goodPostieSrc from "./assets/images/good-postie.png";
import spikesSrc from "./assets/images/spikes.png";
import dogSrc from "./assets/images/dog.png";

// Audio
const audioFiles = [[SoundType.BOING, boingSrc]];

// Images
const imageFiles = [tilesetSrc, postieSrc, goodPostieSrc, spikesSrc, dogSrc];

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
