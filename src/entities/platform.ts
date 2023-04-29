import kontra from "kontra";
const { SpriteClass } = kontra;

export default class PlatformSprite extends SpriteClass {
  init(props: any) {
    super.init({
      ...props,
      color: "#966F33",
      height: 16,
    });
  }
}
