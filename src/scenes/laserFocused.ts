import { SceneID } from "./constants";
import levelFactory from "./levelFactory";

const laserFocusedScene = levelFactory(SceneID.LASER_FOCUSED, 20);

export default laserFocusedScene;
