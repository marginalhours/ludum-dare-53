import { GameObject, SpriteClass, onKey } from "kontra";

enum ControlState {
  LOADED = "loaded",
  FIRING = "firing",
  RECOVERING = "recovering",
}

class ControlGUI extends SpriteClass {
  init(props: any) {
    super.init(props);

    const { cooldown, duration, onReady, onFinished, onFire, triggerKey } =
      props;

    this.cooldown = cooldown;
    this.duration = duration;
    this.elapsed = 0;
    this.state = ControlState.LOADED;
    this.onReady = onReady;
    this.onFinished = onFinished;
    this.onFire = onFire;
    this.triggerKey = triggerKey;

    const that = this;

    // TODO: call `offKey` in the right place to ditch the callback
    // (or wire this up in a better place)
    onKey(triggerKey, () => {
      if (that.state === ControlState.LOADED) {
        that.state = ControlState.FIRING;
        that.onFire();
        that.elapsed = 0;
      }
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

  render() {
    // At this point, the animation has already been drawn

    const BAR_WIDTH = 8;
    const BAR_BORDER = 1;
    const VERTICAL_GAP = -16;
    const FONT_SIZE = 12;
    const PADDING = 4;

    this.context.save();

    // Now draw UI elements

    this.context.font = `${FONT_SIZE}px monospace bold`;

    // timer bar
    switch (this.state) {
      case ControlState.LOADED:
        // this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
        // this.context.fillRect(-1, VERTICAL_GAP -1, this.width + (2 * BAR_BORDER), BAR_WIDTH + (2 * BAR_BORDER));
        break;
      case ControlState.RECOVERING: {
        const progress = this.elapsed / this.cooldown;
        const alpha = 0.25 + (1 - progress) * 0.75;
        this.context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;

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
        const progress = (this.duration - this.elapsed) / this.duration;
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
    switch (this.state) {
      case ControlState.LOADED:
        this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
        this.context.strokeStyle = "rgba(0, 0, 0, 1.0)";
        break;
      case ControlState.RECOVERING:
      case ControlState.FIRING:
        this.context.fillStyle = "rgba(160, 160, 160, 1.0)";
        this.context.strokeStyle = "rgba(200, 200, 200, 1.0)";
        break;
    }

    const p = this.parent as GameObject;

    this.context.fillRect(
      p.width / 2 - PADDING - FONT_SIZE / 2,
      p.height + 2,
      FONT_SIZE + 2 * PADDING,
      FONT_SIZE + 2 * PADDING
    );
    this.context.strokeText(
      this.triggerKey,
      p.width / 2 - FONT_SIZE / 2,
      p.height + 12 + 4
    );

    this.context.restore();
  }
}

// Base class for everything the player can interact with via keyboard / tap
// Pass `onReady` and `onFinished` callbacks to change animations etc
export default class ControlClass extends SpriteClass {
  init(props: any) {
    super.init(props);
    this.gui = new ControlGUI({
      ...props,
      onReady: () => {
        this.onReady();
      },
      onFinished: () => {
        this.onFinished();
      },
      onFire: () => {
        this.onFire();
      },
    });

    this.addChild(this.gui);
  }

  get state() {
    // proxy state to child gui object
    return this.gui.state;
  }

  update() {
    super.update();
  }
}
