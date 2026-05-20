import { QueryResult, ResultSetHeader } from "mysql2";
import db from "../config/db"

export async function get_user_by_username(username: string) {
    try {
        const sql = "select * from users where username=?"
        const [result]: any = await db.promise().query(sql, [username]);
        return result
    } catch (error) { throw error }
}

export async function get_all_not_following_users(current_user_id: string) {
    try {
        const sql = "select * from users where id not in(select following_id from follows where followers_id=?)"
        const [result]: any = await db.promise().query(sql, [current_user_id]);
        return result
    } catch (error) { throw error }
}

export async function get_user_by_id(id: string) {
    try {
        const sql = "select * from users where id=?"
        const [result]: any = await db.promise().query(sql, [id]);
        return result
    } catch (error) { throw error }
}

export async function find_duplicate_username(userid: string, username: string) {
    try {
        const sql = "select * from users where id!=? && username=?"
        const [result]: any = await db.promise().query(sql, [userid, username]);
        return result
    } catch (error) { throw error }
}

export async function get_user_by_email(email: string) {
    try {
        const sql = "select * from users where email=?"
        const [result]: any = await db.promise().query(sql, [email]);
        return result
    } catch (error) { throw error }
}

export async function get_user_by_phone_number(phone_number: string) {
    try {
        const sql = "select * from users where phone_number=?"
        const [result]: any = await db.promise().query(sql, [phone_number]);
        return result
    } catch (error) { throw error }
}

export async function insert_user_details(username: string, fname: string, lname: string, email: string, phone_number: string, password: string) {
    try {
        console.log(username,fname,lname,email,phone_number,password)
        const sql = "insert into users(username,first_name,last_name,email,phone_number,password) values(?,?,?,?,?,?)"
        const [result]: any = await db.promise().query(sql, [username, fname, lname, email, phone_number, password])
        return result
    } catch (error) { throw error }
}

export async function get_user_by_email_username(username: string, email: string) {
    try {
        const sql = "select * from users where username=? or email=?"
        const [result] = await db.promise().query(sql, [username, email])
        return result;
    } catch (err) { throw err }
}

export async function update_password(email: string, password: string) {
    try {
        const sql = "update users set password=? where email=?"
        const [result] = await db.promise().query(sql, [password, email])
        return result;
    } catch (err) { throw err }
}

export async function get_user_tweets(id: string) {
    try {
        const sql = "select user_id,tweet_id,tweet_content,media_url,create_at from tweets t left join media m on t.id=m.tweet_id where user_id=? order by create_at desc"
        const [result] = await db.promise().query(sql, [id])
        return result
    } catch (err) { throw err }
}

export async function get_user_followers(id: string) {
    try {
        const sql = "select * from users where id in (select followers_id from follows where following_id=?)"
        const [result] = await db.promise().query(sql, [id])
        return result
    } catch (err) { throw err }
}

export async function get_user_followings(id: string) {
    try {
        const sql = "select * from users where id in (select following_id from follows where followers_id=?)"
        const [result] = await db.promise().query(sql, [id])
        return result
    } catch (err) { throw err }
}

export async function update_users(id: string, username: string, first_name: string, last_name: string, phone_number: string, bio: string, profile_picture: string, cover_picture: string) {
    try {
        const sql = "update users set username=?,first_name=?, last_name=?, phone_number=?, bio=?, profile_picture=?, cover_picture=? where id=?";
        const result = await db.promise().query(sql, [username, first_name, last_name, phone_number, bio, profile_picture, cover_picture, id])
        console.log(result)
        return result
    } catch (err) { throw err }
}

export async function insert_tweet(userid: string, content: string, imgpath: string) {
    try {
        const sql = "insert into tweets(user_id,tweet_content) values(?,?)";
        const [result]: any = await db.promise().query(sql, [userid, content])
        const sql2 = "insert into media(tweet_id,media_url) values(?,?)";
        if (imgpath) {
            const [result2] = await db.promise().query(sql2, [result.insertId, imgpath])
            console.log(result, result2)
        }
        return result;
    } catch (err) { throw err }
}

export async function select_tweets_all_user() {
    try {
        const sql = `select u.id as user_id,u.username,u.profile_picture,t.id as tweet_id,t.tweet_content,t.create_at,m.media_url from users u 
        inner join tweets t on u.id=t.user_id 
        left join media m on t.id=m.tweet_id 
        order by create_at desc`
        const [result] = await db.promise().query(sql);
        return result;
    } catch (err) { throw err }
}

// like function models

export async function select_tweets_likes(user_id: string) {
    try {
        const sql = `SELECT t.id,t.create_at,COUNT(l.user_id) AS like_count,max(case when l.user_id=? then 1 else 0 end) as like_by_me FROM tweets t 
LEFT JOIN likes l ON t.id = l.tweet_id 
GROUP BY t.id, t.create_at
ORDER BY t.create_at DESC;`

        const [result] = await db.promise().query(sql, [user_id])
        return result;
    } catch (err) { throw err }
}

export async function insert_like(tweet_id: string, user_id: string) {
    try {
        const sql = "insert into likes(tweet_id,user_id) values(?,?)"
        const result = await db.promise().query(sql, [tweet_id, user_id])
        return result;
    } catch (err) { throw err }
}

export async function delete_like(tweet_id: string, user_id: string) {
    try {
        const sql = "delete from likes where tweet_id=? && user_id=?"
        const [result] = await db.promise().query(sql, [tweet_id, user_id])
        return result;
    } catch (err) { throw err }
}

export async function find_user_like(tweet_id: string, user_id: string) {
    try {
        const sql = "select * from likes where tweet_id=? && user_id=?"
        const [result] = await db.promise().query(sql, [tweet_id, user_id])
        return result;
    } catch (err) { throw err }
}

export async function select_current_user_tweet_like(user_id: string) {
    try {
        const sql = `select t.id as tweet_id,count(l.user_id) as like_count,max(case when l.user_id=? then 1 else 0 end) as like_by_me,t.create_at from tweets t
         left join likes l on t.id=l.tweet_id where t.user_id=? 
         group by t.id 
         order by t.create_at desc`
        const [result] = await db.promise().query(sql, [user_id, user_id])
        return result;
    } catch (err) {
        throw err
    }

}

// followings model

export async function insert_following(followers_id: string, following_id: string) {
    try {
        const sql = "insert into follows(followers_id,following_id) value(?,?)"
        const [result] = await db.promise().query(sql, [followers_id, following_id])
        return result;
    } catch (err) { throw err }
}

export async function delete_following(followers_id: string, following_id: string) {
    try {
        const sql = "delete from follows where followers_id=? && following_id=?"
        const [result] = await db.promise().query(sql, [followers_id, following_id])
        return result;
    } catch (err) { throw err }
}

export async function select_user_following(followers_id: string, following_id: string) {
    try {
        const sql = "select following_id from follows where followers_id=? && following_id=?"
        const [result] = await db.promise().query(sql, [followers_id, following_id])
        return result;
    } catch (err) { throw err }
}


//comments functionality

export async function get_comments_counts() {
    try {
        const sql = `select t.id,t.tweet_content,count(c.id) as comment_count from tweets t 
        left join comments c on t.id=c.tweet_id  
        group by t.id 
        order by t.create_at desc;`
        const [result] = await db.promise().query(sql);
        return result;
    } catch (err) { throw err }
}

export async function insert_comments(userid: string, tweetid: string, msg: string) {
    try {
        const sql = `insert into comments(tweet_id,user_id,message) values(?,?,?)`
        const [result] = await db.promise().query(sql, [tweetid, userid, msg]);
        return result;
    } catch (err) { throw err }
}

export async function select_tweets_comments(tweet_id: string) {
    try {
        const sql = `select u.id,u.username,u.first_name,u.last_name,u.profile_picture,
        c.message,c.created_at from users u 
        inner join comments c on u.id=c.user_id 
        where c.tweet_id=?`
        const [result] = await db.promise().query(sql, [tweet_id]);
        return result;
    } catch (err) { throw err }
}

export async function get_user_comments_counts(user_id: string) {
    try {
        const sql = `select t.id,t.tweet_content,count(c.id) as comment_count from tweets t 
        left join comments c on t.id=c.tweet_id  
        where t.user_id=?
        group by t.id
        order by t.create_at desc;`
        const [result] = await db.promise().query(sql, user_id);
        return result;
    } catch (err) { throw err }
}

export async function search_user_by_username_firstname(username: string, first_name: string) {
    try {
        const sql = "select * from users where username like ? || first_name like ?"
        const [result] = await db.promise().query(sql, [username + "%", first_name + "%"])
        return result
    } catch (err) {
        throw err
    }
}

// tweets functionality

export async function delete_tweet(tweet_id: string) {
    try {
        const sql = "delete from tweets where id=?"
        const [result] = await db.promise().query(sql, [tweet_id])
        return result
    } catch (err) {
        throw err
    }
}


// retweet functionality
export async function get_retweet_counts() {
    try {
        const sql = `select t.id,count(r.user_id) as retweet_count from tweets t 
        left join retweets r on t.id=r.tweet_id 
        group by t.id  
        order by create_at desc`
        const [result] = await db.promise().query(sql);
        return result;
    } catch (err) { throw err }
}

export async function get_user_retweet_counts(user_id: string) {
    try {
        const sql = `select t.id,count(r.user_id) as retweet_count from tweets t 
        left join retweets r on t.id=r.tweet_id 
        where t.user_id = ?
        group by t.id  
        order by create_at desc`
        const [result] = await db.promise().query(sql, [user_id]);
        return result;
    } catch (err) { throw err }
}

export async function insert_retweet(userid: string, tweetid: string) {
    try {
        const sql = `insert into retweets(tweet_id,user_id) values(?,?)`
        const [result] = await db.promise().query(sql, [tweetid, userid]);
        return result;
    } catch (err) { throw err }
}

export async function delete_retweet(userid: string, tweetid: string) {
    try {
        const sql = `delete from retweets where tweet_id=? && user_id=?`
        const [result] = await db.promise().query(sql, [tweetid, userid]);
        return result;
    } catch (err) { throw err }
}

export async function is_already_exist_retweet(userid: string, tweetid: string) {
    try {
        const sql = `select * from retweets where tweet_id=? && user_id=?`
        const [result] = await db.promise().query(sql, [tweetid, userid]);
        return result;
    } catch (err) { throw err }
}

export async function get_user_retweet(userid: string) {
    try {
        const sql = `
        select t.*,m.media_url,r.user_id,r.created_at from tweets t 
        inner join retweets r on t.id=r.tweet_id 
        left join media m on t.id=m.tweet_id 
        where r.user_id=?
        order by r.created_at desc
        `
        const [result] = await db.promise().query(sql, [userid])
        return result
    } catch (err) {
        throw err;
    }
}

export async function get_retweet_userdata(userid: string) {
    try {
        const sql = `
        select u.id as user_id,u.username,u.profile_picture,t.id as tweet_id,t.user_id as tweet_user_id ,r.user_id as retweet_user_id,r.created_at from tweets t 
        inner join retweets r on t.id=r.tweet_id 
        inner join users u on t.user_id=u.id
        where r.user_id=2
        order by r.created_at desc
        `
        const [result] = await db.promise().query(sql, [userid])
        return result
    } catch (err) {
        throw err;
    }
}

export async function get_retweet_like_count(userid: string) {
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
        `
        const [result] = await db.promise().query(sql, [userid,userid])
        return result;
    } catch (err) {
        throw err
    }
}

export async function get_retweet_comment_count(userid: string) {
    try {
        const sql = `
             select t.id as tweet_id,r.created_at,count(c.user_id) as comment_count from tweets t
inner join retweets r on t.id=r.tweet_id
left join comments c  on t.id = c.tweet_id
where r.user_id = ?
group by t.id,t.user_id,r.created_at
order by r.created_at desc;
        `
        const [result] = await db.promise().query(sql, [userid])
        return result;
    } catch (err) {
        throw err
    }
}





