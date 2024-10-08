import main from "./main.js";
// import messages from "./messagesRoutes.js";
// import groups from "./groupsRoutes.js";
import users from "./users.js";

const controllers = [main, users];

export default (app) => controllers.forEach((f) => f(app));
