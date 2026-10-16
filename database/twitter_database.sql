create database if not exists twitter;

use twitter;
CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(50),
  first_name varchar(50),
  last_name varchar(50),
  email varchar(255),
  phone_number varchar(10),
  password varchar(255),
  bio text,
  date_of_birth date,
  profile_picture text,
  cover_picture text,
  created_at timestamp default current_timestamp
);


CREATE TABLE follows (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  followers_id int,
  following_id int,
  created_at timestamp default current_timestamp
);

CREATE TABLE tweets (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id int,
  tweet_content text,
  create_at timestamp default current_timestamp
);

CREATE TABLE likes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tweet_id int,
  user_id int,
  created_at timestamp default current_timestamp
);

CREATE TABLE comments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tweet_id int,
  user_id int,
  parent_id int,
  message varchar(255),
  craeted_at timestamp default current_timestamp
);

CREATE TABLE media (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tweet_id int,
  media_url text,
  media_type varchar(50)
);

ALTER TABLE follows ADD CONSTRAINT user_followers FOREIGN KEY (followers_id) REFERENCES users (id);

ALTER TABLE follows ADD CONSTRAINT user_following FOREIGN KEY (following_id) REFERENCES users (id);

ALTER TABLE tweets ADD CONSTRAINT user_tweets FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE comments ADD CONSTRAINT tweet_comments FOREIGN KEY (tweet_id) REFERENCES tweets (id);

ALTER TABLE comments ADD CONSTRAINT user_comments FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE media ADD CONSTRAINT tweet_media FOREIGN KEY (tweet_id) REFERENCES tweets (id);

ALTER TABLE likes ADD CONSTRAINT tweet_like FOREIGN KEY (tweet_id) REFERENCES tweets (id);

ALTER TABLE likes ADD CONSTRAINT user_like FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE comments ADD CONSTRAINT comment_reply FOREIGN KEY (parent_id) REFERENCES comments (id);
