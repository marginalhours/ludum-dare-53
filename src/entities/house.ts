import { SpriteClass, imageAssets } from "kontra";
import houseSrc from "../assets/images/house.png";

export default class HouseSpriteClass extends SpriteClass {
  init(props: any) {
    super.init({ ...props, image: imageAssets[houseSrc] });
  }
}
