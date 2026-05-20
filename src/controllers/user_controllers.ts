import { Request, Response } from "express";
import { delete_following, delete_like, delete_retweet, delete_tweet, find_duplicate_username, find_user_like, get_all_not_following_users, get_comments_counts, get_retweet_comment_count, get_retweet_counts, get_retweet_like_count, get_retweet_userdata, get_user_by_id, get_user_comments_counts, get_user_followers, get_user_followings, get_user_retweet, get_user_retweet_counts, get_user_tweets, insert_comments, insert_following, insert_like, insert_retweet, insert_tweet, is_already_exist_retweet, search_user_by_username_firstname, select_current_user_tweet_like, select_tweets_all_user, select_tweets_comments, select_tweets_likes, select_user_following, update_users } from "../models/user_model";
import multer from "multer"
import "express-session"
import { Request_session } from "../types/express_session";



export async function get_user_profile(req : Request_session,res : Response){
    const userid = req.session.userid || ""
    console.log(userid)
    if(!userid){
        return res.redirect("/login")
    }
    const [userdata] = await get_user_by_id(userid);
    console.log(userdata);
    const user_tweets = await get_user_tweets(userid);
    console.log("user tweets ",user_tweets)
    const user_followers = await get_user_followers(userid)
    console.log("followers : ",user_followers)
    const user_followings = await get_user_followings(userid)
    console.log("followings : ",user_followings)
    const user_tweet_likes = await select_current_user_tweet_like(userid)
    console.log("likes : ",user_tweet_likes)
    const comments = await get_user_comments_counts(userid)
    const user_retweet = await get_user_retweet_counts(userid)
    res.render("user/profile",{userdata,user_tweets,user_followers,user_followings,user_tweet_likes,comments,user_retweet,section : "tweets"})
}

export async function edit_user_profile(req : Request,res : Response){
    const userid : string = req.params.id?.toString() || "";
    if(!userid) return res.redirect("/login")
    try{
        const [userdata] = await get_user_by_id(userid)
        console.log(userdata)
        return res.render("user/edit_profile",{userdata})
    }catch(err){
        console.log(err)
        return res.redirect("/login")
    }
    
}

export async function update_user_profile(req:Request,res : Response) {
    const userid : string = req.params.id?.toString() || "";
    if(!userid || !req.body) return res.send("user is invalid")
    try{
        const [userdata] = await get_user_by_id(userid)
        // console.log(userdata);
        const duplicate_username = await find_duplicate_username(userid,req.body.username)
        console.log("duplicate username",duplicate_username)
        if(duplicate_username.length>0){
            return res.render("user/edit_profile",{userdata,error : "username is already exist"})
        }
    // console.log(req.body)
    // console.log(req.files)
    if(req.files?.length){
    const [cover_upload,profile_upload] : any = req.files;
    const result = await update_users(userid,req.body.username,req.body.first_name,req.body.last_name,req.body.phone_number,req.body.bio,"/uploads/"+profile_upload.filename || "","/uploads/"+cover_upload.filename || "") 
    console.log(result)
    }else{
        const result = await update_users(userid,req.body.username,req.body.first_name,req.body.last_name,req.body.phone_number,req.body.bio,userdata.profile_picture|| "",userdata.cover_picture || "") 
    console.log(result)
    }
    return res.redirect("/user/profile")
    }catch(err){
        console.log(err)
        return res.send("failed to update user profile");
    }
    
}

export async function get_tweet_post_form(req : Request, res : Response){
    if(!req.session.userid) return res.redirect("/login")
    try{
        const [userdata] = await get_user_by_id(req.session.userid);
        return res.render("user/tweet_post_form",{userdata})
    }catch(err){
        console.log(err)
        return res.redirect("/login")
    }
}

export async function post_tweet(req : Request, res : Response){
    if(!req.session.userid) return res.redirect("/login")
    try{
        console.log(req.body)
        console.log(req.file)
        const result = await insert_tweet(req.session.userid,req.body.tweet_content,req.file ? "/uploads/"+req.file.filename : "")
        return res.redirect("/user/profile")
    }catch(err){
        console.log(err)
        return res.redirect("/login")
    }
}

export async function search_user(req : Request,res : Response){
    if(!req.session.userid) return res.redirect("/login")
    try{
        const users = await get_all_not_following_users(req.session.userid)
        // console.log(users)
        const users_data = users.filter((user : any)=>user.id!=req.session.userid)
        return res.render("user/search_user",{users : users_data})
    }catch(error){
        console.log(error)
        return res.redirect("/login")
    }
}

export async function user_home_page(req:Request,res : Response) {
    if(!req.session.userid) return res.redirect("/login")
        try{
        const data = await select_tweets_all_user()
        console.log("home tweets",data)
        const likes = await select_tweets_likes(req.session.userid);
        console.log("home tweet like",likes)
        const comments = await get_comments_counts()
        console.log("comments",comments)
        const retweet = await get_retweet_counts();
        return res.render("user/user_home",{data,likes,comments,retweet})
    }catch(error){
        console.log(error)
        return res.redirect("/login")
    }
}

export async function set_to_following(req : Request, res : Response){
    console.log(req.body)
    if(!req.session.userid || ! req.body.following_id) return res.status(400).json({msg : "user is not found"})
    try{
        const result = await insert_following(req.session.userid,req.body.following_id)
        console.log(result)
        return res.status(200).json({msg : "user set to there following user"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "server error in set following"})
    }

}

export async function unfollow_user(req:Request,res:Response) {
    console.log(req.params.following_id)
    if(!req.session.userid || !req.params.following_id) return res.status(400).json({msg : "user is not found"})
    try{
        const following_id = req.params.following_id
        if(!Array.isArray(following_id)){
            const result = await delete_following(req.session.userid,following_id?.toString() || "")
            console.log(result)
            return res.status(200).json({msg : "user set to there following user"})
        }
        return res.status(400).json({msg : "invalid data"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "server error in unfollow users"})
    }
}

export async function remove_follower(req:Request,res:Response) {
    console.log(req.params.follower_id)
    if(!req.session.userid || !req.params.follower_id) return res.status(400).json({msg : "user is not found"})
    try{
        const follower_id = req.params.follower_id
        if(!Array.isArray(follower_id)){
            const result = await delete_following(follower_id?.toString() || "",req.session.userid)
            console.log(result)
            return res.status(200).json({msg : "user set to there following user"})
        }
        return res.status(400).json({msg : "invalid data"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "server error in unfollow users"})
    }
}

// tweet like and dislike controllers;;

export async function like_tweet(user_id : string,tweet_id : string){
    if(!user_id || !tweet_id) return {status : 400,msg : "user is not found"}
    try{
        const result = await insert_like(tweet_id,user_id);
        return {status : 200,msg : "inserted like",data : result}
    }catch(err){
        console.log(err)
        return { status : 500 , msg : "server error to insert like"}
    }
}

export async function dislike_tweet(user_id : string,tweet_id : string){
    if(!user_id || !tweet_id) return {status : 400,msg : "user is not found"}
    try{
        const result = await delete_like(tweet_id,user_id);
        return {status : 200,msg : "deleted like",data : result}
    }catch(err){
        console.log(err)
        return { status : 500 , msg : "server error to insert like"}
    }
}

export async function like_dislike_tweet(req : Request,res : Response){
    console.log(req.body.tweet_id)
    if(!req.session.userid || !req.body.tweet_id) return res.status(400).json({msg : "user is not found"})
    try{

        const [result] : any = await find_user_like(req.body.tweet_id,req.session.userid)
        console.log(result)
        if(result){
            const dislike_result = await dislike_tweet(req.session.userid,req.body.tweet_id)
            console.log(dislike_result)
            return res.status(200).json({msg : "dislike"})
        }else{
            const like_result = await like_tweet(req.session.userid,req.body.tweet_id)
            console.log(like_result);
            return res.status(200).json({msg : "like"})
        }

    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "error to like dislike tweet"})
    }
}


// comments controllers
export async function post_comment(req : Request,res : Response){
    if(!req.session.userid || !req.body.comment || !req.body.tweet_id) return res.status(400).json({msg : "something wrong we can't post comment"})
    console.log(req.body,req.session.userid)
    try{

        const result = await insert_comments(req.session.userid,req.body.tweet_id,req.body.comment);
        return res.status(200).json({msg : "comment insert successfully"})

    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "something is wrong with server"})
    }
}

export async function get_tweet_comments(req : Request,res : Response){
    const tweet_id = req.params.tweet_id?.toString() || ""
    if(!req.session.userid || !tweet_id) return res.status(400).json({msg : "something wrong we can't get comment"})
    
    try{
        const result = await select_tweets_comments(tweet_id);
        return res.status(200).json({comments : result})
    }catch(err){
        console.log(err)
        res.status(500).json({msg : "something wrong we can't get comment"})
    }
}

//search users

export async function search_users_list(req : Request,res : Response){
    if(!req.session.userid || !req.body.user_input) return res.status(400).json({msg : "something wrong we can't search users"})

    try{
        console.log(req.body)
        const result = await search_user_by_username_firstname(req.body.user_input,req.body.user_input)
        console.log(result)
        return res.status(200).json({users : result})
    }catch(err){
        console.log(err)
        return res.status(400).json({msg : "something wrong we can't search users"})
    }
}

// view user profiles

export async function get_view_user_profile(req : Request_session,res : Response){
    const view_userid = req.params.view_user_id?.toString() || ""
    console.log(view_userid)
    if(!view_userid || !req.session.userid){
        return res.redirect("/login")
    }
    if(view_userid == req.session.userid){
        return res.redirect("/user/profile")
    }
    const [userdata] = await get_user_by_id(view_userid);
    console.log(userdata);
    const user_tweets = await get_user_tweets(view_userid);
    console.log("user tweets ",user_tweets)
    const user_followers = await get_user_followers(view_userid)
    console.log("followers : ",user_followers)
    const user_followings = await get_user_followings(view_userid)
    console.log("followings : ",user_followings)
    const user_tweet_likes = await select_current_user_tweet_like(view_userid)
    console.log("likes : ",user_tweet_likes)
    const comments = await get_user_comments_counts(view_userid)
    const is_follow_me = await select_user_following(req.session.userid,view_userid);
    console.log(is_follow_me)
    res.render("user/view_user_profile",{userdata,user_tweets,user_tweet_likes,comments,user_followers,user_followings,is_follow_me})
}


//delete user tweets
export async function delete_user_tweet(req : Request,res : Response){
    if(!req.session.userid || !req.body.tweet_id || !req.body.user_id) return res.status(400).json({msg : "something went wrong, can't delete tweet"})

    try{
        console.log("delete tweet : ",req.session.userid,req.body.user_id)
        if(req.session.userid != req.body.user_id){ 
            return res.status(401).json({msg : "you can not delete someone else tweet"})
        }
        const result = await delete_tweet(req.body.tweet_id);
        console.log(result)
        return res.status(200).json({msg : "tweet delete successfully"})
    }catch(err){
        console.log(err)
        return res.status(400).json({msg : "something went wrong, can't delete tweet"})
    }
}

// retweet controller

export async function insert_delete_retweet(req : Request , res : Response){
     if(!req.session.userid || !req.body.tweet_id) return res.status(400).json({msg : "something went wrong, missing something"})
    try{
        const user_id = req.session.userid;
        const tweet_id = req.body.tweet_id;
        const [is_exist] : any = await is_already_exist_retweet(user_id,tweet_id)
        console.log(is_exist)
        if(is_exist){
            const result = await delete_retweet(user_id,tweet_id)
            console.log("delete retweet")
            return res.status(200).json({msg : "retweet delete"})
        }else{
            const result = await insert_retweet(user_id,tweet_id);
            console.log("insert retweet")
            return res.status(200).json({msg : "retweet insert"})
        }
        
    }catch(err){
        console.log(err)
        res.status(400).json({msg : "something went wrong, can't insert or delete retweet"})
    }
}

export async function get_user_retweets(req : Request,res : Response)
{
    console.log("get_user_retweets")
    if(!req.session.userid) return res.status(400).json({msg : "user is not found"})
    try{
        const userid = req.session.userid;
        const [userdata] = await get_user_by_id(userid);
        console.log(userdata);
        const user_tweets = await get_user_tweets(userid);

        const user_followers = await get_user_followers(userid)
        console.log("followers : ",user_followers)
        const user_followings = await get_user_followings(userid)
        console.log("followings : ",user_followings)

        const tweet_userdata = await get_retweet_userdata(userid)
        console.log(userdata);
        const retweets = await get_user_retweet(userid)
        console.log("retweets : ",retweets)
        const likes = await get_retweet_like_count(userid)
        console.log("like : ",likes)
        const comments = await get_retweet_comment_count(userid)
        console.log("commments : ",comments)
        const retweet_count = await get_user_retweet_counts(userid)
        console.log("retweet count : ",retweet_count)
        return res.status(200).render("user/profile",{userdata,user_tweets,tweet_userdata,retweets,likes,comments,retweet_count,user_followers,user_followings,section : "retweet"})
    }catch(err){
        console.log(err)
        return res.status(400).json({msg : "something went wrong,can't load retweets"})
    }
}