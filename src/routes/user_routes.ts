import { Request, Response, Router } from "express";
import { delete_user_tweet, edit_user_profile, get_tweet_comments, get_tweet_post_form, get_user_profile, get_user_retweets, get_view_user_profile, insert_delete_retweet, like_dislike_tweet, post_comment, post_tweet, remove_follower, search_user, search_users_list, set_to_following, unfollow_user, update_user_profile, user_home_page } from "../controllers/user_controllers";
import multer from "multer";
import path from "path"
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/uploads"))
    },
    filename : (req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const uploads = multer({storage})

const router = Router()

router.get("/profile",get_user_profile)
router.get("/edit/:id",edit_user_profile)
router.get("/tweet_post",get_tweet_post_form)
router.get("/search",search_user)
router.get("/home",user_home_page)
router.get("/get_tweet_comments/:tweet_id",get_tweet_comments)
router.get("/get_view_user_profile/:view_user_id",get_view_user_profile)
router.get("/get_user_retweets",get_user_retweets)

router.post("/edit/:id",uploads.any(),update_user_profile)
router.post("/tweet_post",uploads.single("tweet_img"),post_tweet)
router.post("/set_to_following",set_to_following)
router.post("/like_dislike_tweet",like_dislike_tweet)
router.post("/post_comment",post_comment)
router.post("/search_users_list",search_users_list)
router.post("/delete_user_tweet",delete_user_tweet)
router.post("/insert_delete_retweet",insert_delete_retweet)

router.delete("/unfollow/:following_id",unfollow_user)
router.delete("/remove_follower/:follower_id",remove_follower)

export default router