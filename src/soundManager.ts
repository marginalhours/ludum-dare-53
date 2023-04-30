import { Howl } from "howler";

// Filenames in the assets/audio folder
// Use MP3 where possible; it's got better browser compatibility
export enum SoundType {
  Boing = "boing.ogg",
  Dog1 = "dog1.mp3",
  Dog2 = "dog2.mp3",
  Dog3 = "dog3.mp3",
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
  const sound = getRandom<SoundType>(
    SoundType.Dog1,
    SoundType.Dog2,
    SoundType.Dog3
  );
  playSound(sound);
}

function getRandom<T>(...items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
