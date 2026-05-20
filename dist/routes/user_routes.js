"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user_controllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../public/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const uploads = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.get("/profile", user_controllers_1.get_user_profile);
router.get("/edit/:id", user_controllers_1.edit_user_profile);
router.get("/tweet_post", user_controllers_1.get_tweet_post_form);
router.get("/search", user_controllers_1.search_user);
router.get("/home", user_controllers_1.user_home_page);
router.get("/get_tweet_comments/:tweet_id", user_controllers_1.get_tweet_comments);
router.get("/get_view_user_profile/:view_user_id", user_controllers_1.get_view_user_profile);
router.get("/get_user_retweets", user_controllers_1.get_user_retweets);
router.post("/edit/:id", uploads.any(), user_controllers_1.update_user_profile);
router.post("/tweet_post", uploads.single("tweet_img"), user_controllers_1.post_tweet);
router.post("/set_to_following", user_controllers_1.set_to_following);
router.post("/like_dislike_tweet", user_controllers_1.like_dislike_tweet);
router.post("/post_comment", user_controllers_1.post_comment);
router.post("/search_users_list", user_controllers_1.search_users_list);
router.post("/delete_user_tweet", user_controllers_1.delete_user_tweet);
router.post("/insert_delete_retweet", user_controllers_1.insert_delete_retweet);
router.delete("/unfollow/:following_id", user_controllers_1.unfollow_user);
router.delete("/remove_follower/:follower_id", user_controllers_1.remove_follower);
exports.default = router;
//# sourceMappingURL=user_routes.js.map