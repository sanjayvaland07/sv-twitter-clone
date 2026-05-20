import { Request, Response } from "express";
import "express-session";
import { Request_session } from "../types/express_session";
export declare function get_user_profile(req: Request_session, res: Response): Promise<void>;
export declare function edit_user_profile(req: Request, res: Response): Promise<void>;
export declare function update_user_profile(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
export declare function get_tweet_post_form(req: Request, res: Response): Promise<void>;
export declare function post_tweet(req: Request, res: Response): Promise<void>;
export declare function search_user(req: Request, res: Response): Promise<void>;
export declare function user_home_page(req: Request, res: Response): Promise<void>;
export declare function set_to_following(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function unfollow_user(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function remove_follower(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function like_tweet(user_id: string, tweet_id: string): Promise<{
    status: number;
    msg: string;
    data?: never;
} | {
    status: number;
    msg: string;
    data: [import("mysql2").QueryResult, import("mysql2").FieldPacket[]];
}>;
export declare function dislike_tweet(user_id: string, tweet_id: string): Promise<{
    status: number;
    msg: string;
    data?: never;
} | {
    status: number;
    msg: string;
    data: import("mysql2").QueryResult;
}>;
export declare function like_dislike_tweet(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function post_comment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function get_tweet_comments(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function search_users_list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function get_view_user_profile(req: Request_session, res: Response): Promise<void>;
export declare function delete_user_tweet(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function insert_delete_retweet(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function get_user_retweets(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=user_controllers.d.ts.map