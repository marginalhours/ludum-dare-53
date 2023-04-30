import { Howl } from "howler";

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
}

const audioAssets: Record<string, Howl> = {};

export const registerSound = (path: string, sound: Howl) => {
  const filename = path.split("/").slice(-1).pop() as SoundType;
  audioAssets[filename] = sound;
};

export const playSound = (sound: SoundType) => {
  audioAssets[sound].play();
};

export function playDog(): void {
  playSound(getRandom(SoundType.Dog1, SoundType.Dog2, SoundType.Dog3));
}

export function playGib(): void {
  playSound(getRandom(SoundType.Gib1, SoundType.Gib2, SoundType.Gib3));
}

function getRandom<T>(...items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
