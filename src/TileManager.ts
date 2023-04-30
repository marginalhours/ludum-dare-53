import { imageAssets, TileEngine } from "kontra";
import tilesetJson from "./assets/data/tileset.json";
import tilesetSrc from "./assets/images/tileset-new.png";

export interface Position {
  x: number;
  y: number;
}

export class TileManager {
  static TILE_EMPTY = 0;

  static #instance: TileManager;

  static getInstance(): TileManager {
    return this.#instance || (this.#instance = new TileManager());
  }

  tileEngine: TileEngine;

  constructor() {
    const properties = tilesetJson as any;

    properties.tilesets[0].image = imageAssets[tilesetSrc];

    this.tileEngine = TileEngine(tilesetJson);
  }

  getTileAtPosition(position: Position): number {
    return this.tileEngine.tileAtLayer("world", position);
  }

  isTileAtPosition(position: Position): boolean {
    return this.getTileAtPosition(position) !== TileManager.TILE_EMPTY;
  }
}
