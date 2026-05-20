"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_by_username = get_user_by_username;
exports.get_all_not_following_users = get_all_not_following_users;
exports.get_user_by_id = get_user_by_id;
exports.find_duplicate_username = find_duplicate_username;
exports.get_user_by_email = get_user_by_email;
exports.get_user_by_phone_number = get_user_by_phone_number;
exports.insert_user_details = insert_user_details;
exports.get_user_by_email_username = get_user_by_email_username;
exports.update_password = update_password;
exports.get_user_tweets = get_user_tweets;
exports.get_user_followers = get_user_followers;
exports.get_user_followings = get_user_followings;
exports.update_users = update_users;
exports.insert_tweet = insert_tweet;
exports.select_tweets_all_user = select_tweets_all_user;
exports.select_tweets_likes = select_tweets_likes;
exports.insert_like = insert_like;
exports.delete_like = delete_like;
exports.find_user_like = find_user_like;
exports.select_current_user_tweet_like = select_current_user_tweet_like;
exports.insert_following = insert_following;
exports.delete_following = delete_following;
exports.select_user_following = select_user_following;
exports.get_comments_counts = get_comments_counts;
exports.insert_comments = insert_comments;
exports.select_tweets_comments = select_tweets_comments;
exports.get_user_comments_counts = get_user_comments_counts;
exports.search_user_by_username_firstname = search_user_by_username_firstname;
exports.delete_tweet = delete_tweet;
exports.get_retweet_counts = get_retweet_counts;
exports.get_user_retweet_counts = get_user_retweet_counts;
exports.insert_retweet = insert_retweet;
exports.delete_retweet = delete_retweet;
exports.is_already_exist_retweet = is_already_exist_retweet;
exports.get_user_retweet = get_user_retweet;
exports.get_retweet_userdata = get_retweet_userdata;
exports.get_retweet_like_count = get_retweet_like_count;
exports.get_retweet_comment_count = get_retweet_comment_count;
const db_1 = __importDefault(require("../config/db"));
async function get_user_by_username(username) {
    try {
        const sql = "select * from users where username=?";
        const [result] = await db_1.default.promise().query(sql, [username]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function get_all_not_following_users(current_user_id) {
    try {
        const sql = "select * from users where id not in(select following_id from follows where followers_id=?)";
        const [result] = await db_1.default.promise().query(sql, [current_user_id]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function get_user_by_id(id) {
    try {
        const sql = "select * from users where id=?";
        const [result] = await db_1.default.promise().query(sql, [id]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function find_duplicate_username(userid, username) {
    try {
        const sql = "select * from users where id!=? && username=?";
        const [result] = await db_1.default.promise().query(sql, [userid, username]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function get_user_by_email(email) {
    try {
        const sql = "select * from users where email=?";
        const [result] = await db_1.default.promise().query(sql, [email]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function get_user_by_phone_number(phone_number) {
    try {
        const sql = "select * from users where phone_number=?";
        const [result] = await db_1.default.promise().query(sql, [phone_number]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function insert_user_details(username, fname, lname, email, phone_number, password) {
    try {
        console.log(username, fname, lname, email, phone_number, password);
        const sql = "insert into users(username,first_name,last_name,email,phone_number,password) values(?,?,?,?,?,?)";
        const [result] = await db_1.default.promise().query(sql, [username, fname, lname, email, phone_number, password]);
        return result;
    }
    catch (error) {
        throw error;
    }
}
async function get_user_by_email_username(username, email) {
    try {
        const sql = "select * from users where username=? or email=?";
        const [result] = await db_1.default.promise().query(sql, [username, email]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function update_password(email, password) {
    try {
        const sql = "update users set password=? where email=?";
        const [result] = await db_1.default.promise().query(sql, [password, email]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_user_tweets(id) {
    try {
        const sql = "select user_id,tweet_id,tweet_content,media_url,create_at from tweets t left join media m on t.id=m.tweet_id where user_id=? order by create_at desc";
        const [result] = await db_1.default.promise().query(sql, [id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_user_followers(id) {
    try {
        const sql = "select * from users where id in (select followers_id from follows where following_id=?)";
        const [result] = await db_1.default.promise().query(sql, [id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_user_followings(id) {
    try {
        const sql = "select * from users where id in (select following_id from follows where followers_id=?)";
        const [result] = await db_1.default.promise().query(sql, [id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function update_users(id, username, first_name, last_name, phone_number, bio, profile_picture, cover_picture) {
    try {
        const sql = "update users set username=?,first_name=?, last_name=?, phone_number=?, bio=?, profile_picture=?, cover_picture=? where id=?";
        const result = await db_1.default.promise().query(sql, [username, first_name, last_name, phone_number, bio, profile_picture, cover_picture, id]);
        console.log(result);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function insert_tweet(userid, content, imgpath) {
    try {
        const sql = "insert into tweets(user_id,tweet_content) values(?,?)";
        const [result] = await db_1.default.promise().query(sql, [userid, content]);
        const sql2 = "insert into media(tweet_id,media_url) values(?,?)";
        if (imgpath) {
            const [result2] = await db_1.default.promise().query(sql2, [result.insertId, imgpath]);
            console.log(result, result2);
        }
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function select_tweets_all_user() {
    try {
        const sql = `select u.id as user_id,u.username,u.profile_picture,t.id as tweet_id,t.tweet_content,t.create_at,m.media_url from users u 
        inner join tweets t on u.id=t.user_id 
        left join media m on t.id=m.tweet_id 
        order by create_at desc`;
        const [result] = await db_1.default.promise().query(sql);
        return result;
    }
    catch (err) {
        throw err;
    }
}
// like function models
async function select_tweets_likes(user_id) {
    try {
        const sql = `SELECT t.id,t.create_at,COUNT(l.user_id) AS like_count,max(case when l.user_id=? then 1 else 0 end) as like_by_me FROM tweets t 
LEFT JOIN likes l ON t.id = l.tweet_id 
GROUP BY t.id, t.create_at
ORDER BY t.create_at DESC;`;
        const [result] = await db_1.default.promise().query(sql, [user_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function insert_like(tweet_id, user_id) {
    try {
        const sql = "insert into likes(tweet_id,user_id) values(?,?)";
        const result = await db_1.default.promise().query(sql, [tweet_id, user_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function delete_like(tweet_id, user_id) {
    try {
        const sql = "delete from likes where tweet_id=? && user_id=?";
        const [result] = await db_1.default.promise().query(sql, [tweet_id, user_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function find_user_like(tweet_id, user_id) {
    try {
        const sql = "select * from likes where tweet_id=? && user_id=?";
        const [result] = await db_1.default.promise().query(sql, [tweet_id, user_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function select_current_user_tweet_like(user_id) {
    try {
        const sql = `select t.id as tweet_id,count(l.user_id) as like_count,max(case when l.user_id=? then 1 else 0 end) as like_by_me,t.create_at from tweets t
         left join likes l on t.id=l.tweet_id where t.user_id=? 
         group by t.id 
         order by t.create_at desc`;
        const [result] = await db_1.default.promise().query(sql, [user_id, user_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
// followings model
async function insert_following(followers_id, following_id) {
    try {
        const sql = "insert into follows(followers_id,following_id) value(?,?)";
        const [result] = await db_1.default.promise().query(sql, [followers_id, following_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function delete_following(followers_id, following_id) {
    try {
        const sql = "delete from follows where followers_id=? && following_id=?";
        const [result] = await db_1.default.promise().query(sql, [followers_id, following_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function select_user_following(followers_id, following_id) {
    try {
        const sql = "select following_id from follows where followers_id=? && following_id=?";
        const [result] = await db_1.default.promise().query(sql, [followers_id, following_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
//comments functionality
async function get_comments_counts() {
    try {
        const sql = `select t.id,t.tweet_content,count(c.id) as comment_count from tweets t 
        left join comments c on t.id=c.tweet_id  
        group by t.id 
        order by t.create_at desc;`;
        const [result] = await db_1.default.promise().query(sql);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function insert_comments(userid, tweetid, msg) {
    try {
        const sql = `insert into comments(tweet_id,user_id,message) values(?,?,?)`;
        const [result] = await db_1.default.promise().query(sql, [tweetid, userid, msg]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function select_tweets_comments(tweet_id) {
    try {
        const sql = `select u.id,u.username,u.first_name,u.last_name,u.profile_picture,
        c.message,c.created_at from users u 
        inner join comments c on u.id=c.user_id 
        where c.tweet_id=?`;
        const [result] = await db_1.default.promise().query(sql, [tweet_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_user_comments_counts(user_id) {
    try {
        const sql = `select t.id,t.tweet_content,count(c.id) as comment_count from tweets t 
        left join comments c on t.id=c.tweet_id  
        where t.user_id=?
        group by t.id
        order by t.create_at desc;`;
        const [result] = await db_1.default.promise().query(sql, user_id);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function search_user_by_username_firstname(username, first_name) {
    try {
        const sql = "select * from users where username like ? || first_name like ?";
        const [result] = await db_1.default.promise().query(sql, [username + "%", first_name + "%"]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
// tweets functionality
async function delete_tweet(tweet_id) {
    try {
        const sql = "delete from tweets where id=?";
        const [result] = await db_1.default.promise().query(sql, [tweet_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
// retweet functionality
async function get_retweet_counts() {
    try {
        const sql = `select t.id,count(r.user_id) as retweet_count from tweets t 
        left join retweets r on t.id=r.tweet_id 
        group by t.id  
        order by create_at desc`;
        const [result] = await db_1.default.promise().query(sql);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_user_retweet_counts(user_id) {
    try {
        const sql = `select t.id,count(r.user_id) as retweet_count from tweets t 
        left join retweets r on t.id=r.tweet_id 
        where t.user_id = ?
        group by t.id  
        order by create_at desc`;
        const [result] = await db_1.default.promise().query(sql, [user_id]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function insert_retweet(userid, tweetid) {
    try {
        const sql = `insert into retweets(tweet_id,user_id) values(?,?)`;
        const [result] = await db_1.default.promise().query(sql, [tweetid, userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function delete_retweet(userid, tweetid) {
    try {
        const sql = `delete from retweets where tweet_id=? && user_id=?`;
        const [result] = await db_1.default.promise().query(sql, [tweetid, userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function is_already_exist_retweet(userid, tweetid) {
    try {
        const sql = `select * from retweets where tweet_id=? && user_id=?`;
        const [result] = await db_1.default.promise().query(sql, [tweetid, userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_user_retweet(userid) {
    try {
        const sql = `
        select t.*,m.media_url,r.user_id,r.created_at from tweets t 
        inner join retweets r on t.id=r.tweet_id 
        left join media m on t.id=m.tweet_id 
        where r.user_id=?
        order by r.created_at desc
        `;
        const [result] = await db_1.default.promise().query(sql, [userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_retweet_userdata(userid) {
    try {
        const sql = `
        select u.id as user_id,u.username,u.profile_picture,t.id as tweet_id,t.user_id as tweet_user_id ,r.user_id as retweet_user_id,r.created_at from tweets t 
        inner join retweets r on t.id=r.tweet_id 
        inner join users u on t.user_id=u.id
        where r.user_id=2
        order by r.created_at desc
        `;
        const [result] = await db_1.default.promise().query(sql, [userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_retweet_like_count(userid) {
    try {
        const sql = `
             SELECT 
    t.id AS tweet_id, 
    t.user_id AS tweet_user_id, 
    COUNT(DISTINCT l.user_id) AS like_count,  -- Moved count to SELECT and added DISTINCT
    max(case when l.user_id=? then 1 else 0 end) as like_by_me
FROM tweets t
INNER JOIN retweets r ON t.id = r.tweet_id 
LEFT JOIN likes l ON t.id = l.tweet_id
WHERE r.user_id = 2
GROUP BY t.id, t.user_id, r.created_at  -- Group by non-aggregated columns
ORDER BY r.created_at DESC;
        `;
        const [result] = await db_1.default.promise().query(sql, [userid, userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
async function get_retweet_comment_count(userid) {
    try {
        const sql = `
             select t.id as tweet_id,r.created_at,count(c.user_id) as comment_count from tweets t
inner join retweets r on t.id=r.tweet_id
left join comments c  on t.id = c.tweet_id
where r.user_id = ?
group by t.id,t.user_id,r.created_at
order by r.created_at desc;
        `;
        const [result] = await db_1.default.promise().query(sql, [userid]);
        return result;
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=user_model.js.map