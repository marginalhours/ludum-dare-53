import { GameObject, SpriteClass, onKey } from "kontra";

enum ControlState {
  LOADED = "loaded",
  FIRING = "firing",
  RECOVERING = "recovering",
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
      case ControlState.LOADED:
        // this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
        // this.context.fillRect(-1, VERTICAL_GAP -1, this.width + (2 * BAR_BORDER), BAR_WIDTH + (2 * BAR_BORDER));
        break;
      case ControlState.RECOVERING: {
        const progress = p.elapsed / p.cooldown;
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
        const progress = (p.duration - p.elapsed) / p.duration;
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
      case ControlState.LOADED:
        this.context.fillStyle = "#efe8e8";
        this.context.strokeStyle = "rgba(0, 0, 0, 1.0)";
        break;
      case ControlState.RECOVERING:
      case ControlState.FIRING:
        this.context.fillStyle = "rgba(160, 160, 160, 1.0)";
        this.context.strokeStyle = "rgba(200, 200, 200, 1.0)";
        offset = 2;
        break;
    }

    this.context.fillRect(
      p.width / 2 - PADDING - FONT_SIZE / 2 + offset - 2,
      p.height + 2 + offset,
      FONT_SIZE + 2 * PADDING,
      FONT_SIZE + 2 * PADDING
    );
    this.context.strokeText(
      p.triggerKey,
      p.width / 2 - FONT_SIZE / 2 + offset,
      p.height + 12 + 4 + offset
    );

    this.context.restore();
  }
}

// Base class for everything the player can interact with via keyboard / tap
// Pass `onReady` and `onFinished` callbacks to change animations etc
export default class ControlClass extends SpriteClass {
  init(props: any) {
    super.init(props);

    const { triggerKey, controlClass = ControlGUI } = props;

    this.gui = new controlClass({
      ...props,
    });

    this.state = ControlState.LOADED;

    this.addChild(this.gui);

    onKey(triggerKey, () => {
      this.onDown();
    });
  }

  update() {
    super.update();
    switch (this.state) {
      case ControlState.LOADED:
        // nothing happens
        break;
      case ControlState.RECOVERING:
        this.elapsed += 1;
        if (this.elapsed === this.cooldown) {
          this.state = ControlState.LOADED;
          this.elapsed = 0;
          this.onReady();
        }
        break;
      case ControlState.FIRING:
        this.elapsed += 1;
        if (this.elapsed === this.duration) {
          this.state = ControlState.RECOVERING;
          this.elapsed = 0;
          this.onFinished();
        }
        break;
    }
  }

  onDown() {
    if (this.state === ControlState.LOADED) {
      this.state = ControlState.FIRING;
      this.onFire();
      this.elapsed = 0;
    }
  }
}
