import kontra from "kontra";
import { SceneID } from "./constants";
import PostmanSprite, { gibPostman } from "../entities/postman";
import Spawner from "../entities/spawner";
import { GibPool } from "../entities/gib";
import { initialiseTileEngine } from "../tileEngine";
import { addEntitiesToScene, resetEntities } from "../entities/entityManager";
import guiFactory from "../entities/levelGui";
import { EventType } from "../constants";

const levelFactory = (sceneId: SceneID, totalPosties: number) => {
  const postmanFactory = (sp: Spawner) => {
    let man = new PostmanSprite({
      x: sp.x,
      y: sp.y,
      ddy: 0.1,
      direction: sp.getRandomDirection(),
      murder: () => {
        gibPostman(man);
        sp.scene.remove(man);
        sp.scene.onPostieEliminated();
      },
      onZapped: () => {
        sp.scene.onZap();
      },
      deliver: () => {
        sp.scene.remove(man);
        sp.scene.onPostieDelivered();
      },
    });
    sp.scene.onPostieArrived();
    kontra.track(man);
    return [man];
  };

  const scene = kontra.Scene({
    id: sceneId,
    remainingPosties: totalPosties,
    activePosties: 0,
    score: 0,

    onShow() {
      // reset posties
      this.remainingPosties = totalPosties;
      // reset score
      this.score = 0;
      /// reset zapperCharge
      this.zapperCharge = 100;

      this.add(GibPool);

      this.add(initialiseTileEngine(this.id as SceneID));

      addEntitiesToScene(this, postmanFactory);

      this.gui = guiFactory({ initialRemaining: this.remainingPosties });

      this.add(this.gui);
    },

    update(dt: any) {
      if (!this.hidden) {
        this._o.map((object: any) => object.update && object.update(dt));
      }
      if (this.zapperCharge < 100) {
        this.zapperCharge += 0.25;
        this.gui.setZapperCharge(this.zapperCharge);
      }
    },

    onPostieArrived() {
      this.activePosties += 1;
      this.remainingPosties -= 1;
      if (this.remainingPosties <= 0) {
        this.spawners.map((spawner: Spawner) => spawner.stop());
      }
      this.gui.setRemaining(this.remainingPosties);
    },

    onPostieEliminated() {
      this.activePosties -= 1;
      this.score += 100;
      this.gui.setScore(this.score);
      this.checkFinished();
    },

    onPostieDelivered() {
      this.activePosties -= 1;
      this.score -= 50;
      this.gui.setScore(this.score);
      this.checkFinished();
    },

    checkFinished() {
      if (this.activePosties <= 0 && this.remainingPosties <= 0) {
        setTimeout(() => {
          kontra.emit(EventType.CHANGE_SCENE, SceneID.LEVEL_SELECT);
        }, 2000);
      }
    },

    onHide() {
      // nuke everything currently in the scene (onShow should add them back)
      this.remove(...this._o);
      resetEntities();
    },

    onZap() {
      this.zapperCharge = 0;
    },

    canZap() {
      return this.zapperCharge >= 100;
    },
  });

  return scene;
};

export default levelFactory;
