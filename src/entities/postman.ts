import kontra, {
  collides,
  SpriteSheet,
  imageAssets,
  SpriteClass,
} from "kontra";
import { EventType } from "../constants";
import postie from "../assets/images/postie.png";
import { GibPool } from "./gib";
import { Tiles, getTileAtPosition, isTileWall } from "../tileEngine";
import { getEntities } from "./entityManager";
import DogClass from "./dog";
import SpringClass from "./spring";
import { playGib } from "../soundManager";
import BollardClass from "./bollard";
import SpikeClass from "./spikes";
import TrapdoorClass from "./trapdoor";
import BarbecueClass from "./barbecue";
import FanClass from "./fan";
import { LaserBeamClass } from "./laser";
import SquasherClass from "./squasher";

let spriteSheet: any;

const TILE_SIZE = 32;
const DIRECTION_LEFT = 0;
const DIRECTION_RIGHT = 1;
const SCARED_DURATION = 60;
const BURNING_DURATION = 60;
const SPRING_SPEED = -12;
const FAN_SPEED = -12;

enum PostmanState {
  FALLING = "falling",
  WALKING_LEFT = "walkingLeft",
  WALKING_RIGHT = "walkingRight",
  DEAD = "dead",
  SCARED = "scared",
  BURNING = "burning",
}

kontra.on(EventType.LOADING_COMPLETE, () => {
  spriteSheet = SpriteSheet({
    image: imageAssets[postie],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      falling: {
        frames: "30..35",
        frameRate: 12,
      },
      walking: {
        frames: "2..9",
        frameRate: 12,
      },
      burning: {
        frames: "20..27",
        frameRate: 12,
      },
    },
  });
});

const canvas = kontra.getCanvas();

export default class PostmanSprite extends SpriteClass {
  static WALKING_SPEED = 1;

  scaredElapsed: number = 0;

  state: PostmanState = PostmanState.FALLING;
  isFallingThroughTrapdoor = false;

  init(props: any) {
    super.init({
      ...props,
      animations: spriteSheet.animations,
    });
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.direction = props.direction == null ? DIRECTION_LEFT : props.direction;
  }

  isWalking() {
    return [PostmanState.WALKING_LEFT, PostmanState.WALKING_RIGHT].includes(
      this.state
    );
  }

  onDown() {
    this.murder();
  }

  changeState(nextState: PostmanState) {
    if (nextState === this.state) {
      return;
    }

    switch (nextState) {
      case PostmanState.FALLING:
        this.ddy = 0.1;
        this.dx = 0;
        this.playAnimation("falling");
        this.setScale(1, 1);
        break;

      case PostmanState.WALKING_LEFT:
        this.y = this.y - (this.y % TILE_SIZE);
        this.dx = -PostmanSprite.WALKING_SPEED;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(1, 1);
        this.playAnimation("walking");
        this.direction = DIRECTION_LEFT;
        break;

      case PostmanState.WALKING_RIGHT:
        this.y = this.y - (this.y % TILE_SIZE);
        this.dx = PostmanSprite.WALKING_SPEED;
        this.ddy = 0;
        this.dy = 0;
        this.setScale(-1, 1);
        this.playAnimation("walking");
        this.direction = DIRECTION_RIGHT;
        break;

      case PostmanState.SCARED:
        this.scaredElapsed = 0;
        this.dx = 0;
        this.dy = 0;
        this.playAnimation("falling");
        break;

      case PostmanState.BURNING:
        this.burningElapsed = 0;
        this.playAnimation("burning");
        if (this.direction === DIRECTION_RIGHT) {
          this.setScale(-1, 1);
        }
    }

    this.state = nextState;
  }

  // If walking, will change direction.
  changeDirection(): void {
    switch (this.state) {
      case PostmanState.WALKING_LEFT:
        this.changeState(PostmanState.WALKING_RIGHT);
        break;

      case PostmanState.WALKING_RIGHT:
        this.changeState(PostmanState.WALKING_LEFT);
        break;
    }
  }

  // Continue walking in the last direction you were walking.
  continueWalking(): void {
    this.changeState(
      this.direction === DIRECTION_LEFT
        ? PostmanState.WALKING_LEFT
        : PostmanState.WALKING_RIGHT
    );
  }

  getTileAhead(): number {
    const lookAhead = 10;

    switch (this.state) {
      case PostmanState.WALKING_LEFT:
      case PostmanState.WALKING_RIGHT:
        const x =
          this.x +
          (this.state === PostmanState.WALKING_LEFT ? -1 : 1) * lookAhead;
        return getTileAtPosition({ x, y: this.y - 10 });

      default:
        return NaN;
    }
  }

  update() {
    super.update();

    if (this.x < 0) {
      if (
        this.state === PostmanState.WALKING_LEFT &&
        this.x < -this.width / 2
      ) {
        this.x = canvas.width + this.width / 2;
      }

      return;
    }

    if (this.x >= canvas.width) {
      if (
        this.state === PostmanState.WALKING_RIGHT &&
        this.x >= canvas.width + this.width / 2
      ) {
        this.x = 0 - this.width / 2;
      }

      return;
    }

    if (this.state === PostmanState.SCARED) {
      this.scaredElapsed += 1;

      if (this.scaredElapsed > SCARED_DURATION) {
        this.continueWalking();
      }
    }

    if (this.state === PostmanState.BURNING) {
      this.burningElapsed += 1;
      if (this.burningElapsed > BURNING_DURATION) {
        this.murder();
      }
    }

    const tileAtFeet = getTileAtPosition(this);

    if (tileAtFeet !== Tiles.Empty && !this.isFallingThroughTrapdoor) {
      if (this.state === PostmanState.FALLING) {
        this.changeState(
          this.direction === DIRECTION_LEFT
            ? PostmanState.WALKING_LEFT
            : PostmanState.WALKING_RIGHT
        );
      }
    } else {
      this.isFallingThroughTrapdoor = false;
      this.changeState(PostmanState.FALLING);
    }

    const tileAhead = this.getTileAhead();

    if (isTileWall(tileAhead)) {
      this.changeDirection();
    }

    for (const entity of getEntities()) {
      if (collides(this, entity)) {
        const distanceFromCentre = Math.abs(
          entity.x + 0.5 * TILE_SIZE - this.x
        );

        switch (entity.constructor) {
          case BollardClass:
            if (
              this.isWalking() &&
              distanceFromCentre < 10 &&
              entity.isFiring()
            ) {
              this.murder();
            }
            break;

          case DogClass:
            if (this.isWalking() && entity.isFiring()) {
              if (entity.x > this.x) {
                this.x -= 5 * Math.random();
              } else {
                this.x += 5 * Math.random();
              }
              this.changeState(PostmanState.SCARED);
            }
            break;

          case SpringClass:
            if (this.isWalking() && entity.isFiring()) {
              this.dy = SPRING_SPEED;
            }
            break;

          case SpikeClass:
            if (entity.isFiring() && distanceFromCentre < 10) {
              this.murder();
            }
            break;

          case TrapdoorClass:
            if (entity.isFiring() && distanceFromCentre < 10) {
              this.isFallingThroughTrapdoor = true;
              this.changeState(PostmanState.FALLING);
            }
            break;

          case BarbecueClass:
            if (entity.isFiring() && distanceFromCentre < 10) {
              this.changeState(PostmanState.BURNING);
            }
            break;

          case FanClass:
            if (entity.isFiring() && distanceFromCentre < 10) {
              this.dy = FAN_SPEED;
            }
            break;

          case LaserBeamClass:
            this.murder();
            break;

          case SquasherClass:
            if (entity.isFiring() && distanceFromCentre < 12) {
              this.murder();
              break;
            }
        }
      }
    }
  }
}

export const gibPostman = (man: PostmanSprite) => {
  const gibCount = 48;

  playGib();

  return Array.from(Array(gibCount).keys())
    .map((_) => {
      const arcSize = Math.PI / 2;
      const heading = Math.PI + (0.5 * arcSize - arcSize * Math.random());
      const speed = 2 + 2.5 * Math.random();

      const gib = GibPool.get({
        x: man.x,
        y: man.y,
        heading: heading,
        speed: speed,
        ttl: 150,
      });

      return gib;
    })
    .filter((gib) => gib !== undefined);
};
