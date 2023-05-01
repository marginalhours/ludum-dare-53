import { ButtonClass } from "kontra";

const noop = () => {};

interface HoverableButtonProps {
  onOver: () => void;
  onOut: () => void;
  props: any;
}

export default class HoverableButton extends ButtonClass {
  init({ onOver, onOut, ...props }: HoverableButtonProps) {
    this._oo = onOver || noop;
    this._ooo = onOut || noop;
    super.init(props);
  }

  onOver() {
    this._oo();
    super.onOver();
  }

  onOut() {
    this._ooo();
    super.onOut();
  }
}
