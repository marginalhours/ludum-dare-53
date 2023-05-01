import { Howl } from "howler";

let mute = false;

export function isMuted(): boolean {
  return mute;
}

let currentMusic: SoundType | null;

export function toggleMute(): boolean {
  let mutedNow = (mute = mute === false);

  if (mutedNow) {
    Howler.volume(0.0);
  } else {
    Howler.volume(1.0);
  }

  return mutedNow;
}

// Filenames in the assets/audio folder
// Use MP3 where possible; it's got better browser compatibility
export enum SoundType {
  Boing = "boing.ogg",
  Dog1 = "dog1.mp3",
  Dog2 = "dog2.mp3",
  Dog3 = "dog3.mp3",
  Gib1 = "gib1.mp3",
  Gib2 = "gib2.mp3",
  Gib3 = "gib3.mp3",
  Laser1 = "laser1.mp3",
  Laser2 = "laser2.mp3",
  Laser3 = "laser3.mp3",
  Spikes1 = "spikes1.mp3",
  Spikes2 = "spikes2.mp3",
  Spikes3 = "spikes3.mp3",
  Trapdoor1 = "trapdoor1.mp3",
  Fan1 = "fan1.mp3",
  Fan2 = "fan2.mp3",
  Music1 = "music1.mp3",
  Music3 = "music3.mp3",
}

const audioAssets: Record<string, Howl> = {};

export const registerSound = (path: string, sound: Howl) => {
  const filename = path.split("/").slice(-1).pop() as SoundType;
  audioAssets[filename] = sound;
};

export const playSound = (sound: SoundType) => {
  audioAssets[sound].play();
};

export const stopSound = (sound: SoundType) => {
  audioAssets[sound].stop();
};

export function playDog(): void {
  playSound(getRandom(SoundType.Dog1, SoundType.Dog2, SoundType.Dog3));
}

export function playGib(): void {
  playSound(getRandom(SoundType.Gib1, SoundType.Gib2, SoundType.Gib3));
}

export function playLaser(): void {
  playSound(getRandom(SoundType.Laser1, SoundType.Laser2, SoundType.Laser3));
}

export function playSpikes(): void {
  playSound(getRandom(SoundType.Spikes1, SoundType.Spikes2, SoundType.Spikes3));
}

export function playTrapdoor(): void {
  playSound(SoundType.Trapdoor1);
}

export function playFan(): void {
  playSound(getRandom(SoundType.Fan1, SoundType.Fan2));
}

export function playGameplayMusic(): void {
  if (currentMusic === SoundType.Music1) {
    return;
  }

  if (currentMusic) {
    stopSound(currentMusic);
  }

  currentMusic = SoundType.Music1;
  playSound(SoundType.Music1);
}

export function stopGameplayMusic(): void {
  currentMusic = null;
  stopSound(SoundType.Music1);
}

export function playTitleMusic(): void {
  if (currentMusic === SoundType.Music3) {
    return;
  }

  if (currentMusic) {
    stopSound(currentMusic);
  }

  currentMusic = SoundType.Music3;
  playSound(SoundType.Music3);
}

export function stopTitleMusic(): void {
  currentMusic = null;
  stopSound(SoundType.Music3);
}

function getRandom<T>(...items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
