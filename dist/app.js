"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const user_routes_1 = __importDefault(require("./routes/user_routes"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const test_middleware_1 = require("./middleware/test_middleware");
const captcha_routes_1 = __importDefault(require("./routes/captcha_routes"));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "session-key",
    resave: false,
    saveUninitialized: true,
}));
app.use(test_middleware_1.test_middleware);
app.use("/", auth_routes_1.default);
app.use("/", captcha_routes_1.default);
app.use("/user", user_routes_1.default);
app.listen(3000, () => console.log("server is started on localhost:3000......"));
//# sourceMappingURL=app.js.map