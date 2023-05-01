import { SceneID } from "./constants";
import levelFactory from "./levelFactory";

const niceNEasyScene = levelFactory(SceneID.NICE_N_EASY, 10);

export default niceNEasyScene;
