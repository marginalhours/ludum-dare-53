import { SceneID } from "./constants";
import levelFactory from "./levelFactory";

const laserOverloadScene = levelFactory(SceneID.LASER_OVERLOAD, 50);

export default laserOverloadScene;
