import { SceneID } from "./constants";
import levelFactory from "./levelFactory";

const laserFocusedScene = levelFactory(SceneID.LASER_FOCUSED, 50);

export default laserFocusedScene;
