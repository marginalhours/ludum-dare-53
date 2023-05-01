import { GameObject, SpriteClass, imageAssets, onKey } from "kontra";
import frameSrc from "../assets/images/frame.png";

export enum ControlState {
  RELOADED = "reloaded", // ready to fire
  STARTING = "starting", // transitioning from RELOADED to firing
  FIRING = "firing", // firing
  STOPPING = "stopping", // stopping firing
  RELOADING = "reloading", // cooling down
}

class ControlGUI extends SpriteClass {
  render() {
    // At this point, the animation has already been drawn
    const p = this.parent as GameObject;

    const BAR_WIDTH = 8;
    const BAR_BORDER = 1;
    const VERTICAL_GAP = -16;
    const FONT_SIZE = 16;
    const PADDING = 2;

    this.context.save();

    // Now draw UI elements

    this.context.font = `${FONT_SIZE}px monospace`;

    // timer bar
    switch (p.state) {
      // in these 3 states, timers don't matter
      case ControlState.RELOADED:
      case ControlState.STARTING:
      case ControlState.STOPPING:
        // this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
        // this.context.fillRect(-1, VERTICAL_GAP -1, this.width + (2 * BAR_BORDER), BAR_WIDTH + (2 * BAR_BORDER));
        break;
      case ControlState.RELOADING: {
        const progress = p.elapsed / p.reloadingDuration;
        this.context.fillStyle = `rgba(255, 255, 255, 1.0)`;
        this.context.strokeStyle = `rgba(255, 255, 255, 1.0)`;

        this.context.fillRect(
          0,
          VERTICAL_GAP,
          this.width * progress,
          BAR_WIDTH
        );
        this.context.strokeRect(
          -1,
          VERTICAL_GAP - 1,
          this.width + 2 * BAR_BORDER,
          BAR_WIDTH + 2 * BAR_BORDER
        );
        break;
      }
      case ControlState.FIRING: {
        const progress = (p.firingDuration - p.elapsed) / p.firingDuration;
        this.context.strokeStyle = "rgba(127, 255, 127, 1.0)";
        this.context.fillStyle = "rgba(127, 255, 127, 1.0)";

        this.context.fillRect(
          0,
          VERTICAL_GAP,
          this.width * progress,
          BAR_WIDTH
        );
        this.context.strokeRect(
          -1,
          VERTICAL_GAP - 1,
          this.width + 2,
          BAR_WIDTH + 2 * BAR_BORDER
        );
        break;
      }
    }

    // Keyboard hint
    let offset = 0;

    switch (p.state) {
      case ControlState.RELOADED:
        this.context.fillStyle = "#3a1f1c";
        break;
      default:
        this.context.fillStyle = "#7e4933";
        offset = 2;
        break;
    }

    const frameImage = imageAssets[frameSrc];

    this.context.drawImage(
      frameImage,
      p.width / 2 - PADDING - FONT_SIZE / 2 + offset - 2,
      p.height + 2 + offset
    );

    // this.context.fillRect(
    //   p.width / 2 - PADDING - FONT_SIZE / 2 + offset - 2,
    //   p.height + 2 + offset,
    //   FONT_SIZE + 2 * PADDING,
    //   FONT_SIZE + 2 * PADDING
    // );

    this.context.fillText(
      p.triggerKey,
      p.width / 2 - FONT_SIZE / 2 + offset - 1,
      p.height + 12 + 4 + offset - 1
    );

    this.context.restore();
  }
}

// Base class for everything the player can interact with via keyboard / tap
// Callbacks are:
// onReloaded
// onStarting
// onFiring
// onStopping
// onReloading
//
// these all fire as the control transitions _into_ the above state
//
// We also have exciting duration properties for the above
//
// startingDuration
// firingDuration
// stoppingDuration
// reloadingDuration
//
// there is no loadedDuration because it's up to the user duh
//
// the point of starting / stopping is to have separate "deploy" animations; they're not long-term things
export default class ControlClass extends SpriteClass {
  init(props: any) {
    super.init(props);

    const noop = () => {};

    const {
      startingDuration = 0,
      stoppingDuration = 0,
      firingDuration = 0,
      reloadingDuration = 0,
      onStarting = noop,
      onFiring = noop,
      onStopping = noop,
      onReloading = noop,
      onReloaded = noop,
    } = props;

    this.startingDuration = startingDuration;
    this.stoppingDuration = stoppingDuration;
    this.firingDuration = firingDuration;
    this.reloadingDuration = reloadingDuration;

    this.onStarting = onStarting;
    this.onFiring = onFiring;
    this.onStopping = onStopping;
    this.onReloading = onReloading;
    this.onReloaded = onReloaded;

    const { triggerKey, controlClass = ControlGUI } = props;

    this.gui = new controlClass({
      ...props,
    });

    this.state = ControlState.RELOADED;

    this.addChild(this.gui);

    onKey(triggerKey, () => {
      this.onDown();
    });
  }

  update() {
    super.update();
    switch (this.state) {
      case ControlState.RELOADED:
        // nothing happens
        break;
      case ControlState.STARTING:
        this.elapsed += 1;
        if (this.elapsed >= this.startingDuration) {
          this.state = ControlState.FIRING;
          this.elapsed = 0;
          this.onFiring();
        }
        break;
      case ControlState.FIRING:
        this.elapsed += 1;
        if (this.elapsed >= this.firingDuration) {
          this.state = ControlState.STOPPING;
          this.elapsed = 0;
          this.onStopping();
        }
        break;
      case ControlState.STOPPING:
        this.elapsed += 1;
        if (this.elapsed >= this.stoppingDuration) {
          this.state = ControlState.RELOADING;
          this.elapsed = 0;
          this.onReloading();
        }
        break;
      case ControlState.RELOADING:
        this.elapsed += 1;
        if (this.elapsed >= this.reloadingDuration) {
          this.state = ControlState.RELOADED;
          this.elapsed = 0;
          this.onReloaded();
        }
        break;
    }
  }

  onDown() {
    if (this.state === ControlState.RELOADED) {
      this.state = ControlState.STARTING;
      this.onStarting();
      this.elapsed = 0;
    }
  }

  isFiring() {
    return ![ControlState.RELOADED, ControlState.RELOADING].includes(
      this.state
    );
  }
}
