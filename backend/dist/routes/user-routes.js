import { Router } from "express";
import { getAllUsersController, userLoginController, userLogoutController, userSignupController, verifyUser } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
userRoutes.get("/", getAllUsersController);
userRoutes.post("/signup", validate(signupValidator), userSignupController);
userRoutes.post("/login", validate(loginValidator), userLoginController);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogoutController);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map