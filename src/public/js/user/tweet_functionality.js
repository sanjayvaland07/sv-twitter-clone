// like functionality of tweet
const likebtns = document.querySelectorAll(".like");

likebtns.forEach((likebtn) => {
  likebtn.addEventListener("click", async () => {
    console.log(likebtn.dataset.tweetid);

    const response = await fetch("/user/like_dislike_tweet", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweet_id: likebtn.dataset.tweetid }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.msg == "like") {
        likebtn.firstElementChild.innerHTML = "❤️";
        likebtn.lastElementChild.innerHTML =
          parseInt(likebtn.lastElementChild.innerHTML) + 1;
      } else {
        likebtn.firstElementChild.innerHTML = "♡";
        likebtn.lastElementChild.innerHTML =
          parseInt(likebtn.lastElementChild.innerHTML) - 1;
      }
      console.log("ok");
    } else {
      const data = await response.json();
      console.log(data);
    }
  });
});

//comment functionality

const commentsbtn = document.querySelectorAll(".comment");
const comment_popup = document.getElementById("comment_popup");
const close_comment = document.getElementById("popup-close-comment");

commentsbtn?.forEach(async (commentbtn) => {
  await commentbtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const tweet_id = commentbtn.dataset.tweetid;
    console.log(tweet_id);
    comment_popup.classList.toggle("hide-popup");
    comment_popup.dataset.tweet_id = tweet_id;
    const is_load = await show_comments(tweet_id);
  });
});

const comment_submit_btn = document.getElementById("post_comment");
comment_submit_btn?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (comment_popup.dataset.tweet_id)
    comment_submit_handler(comment_popup.dataset.tweet_id);
});

close_comment.addEventListener("click", () =>
  comment_popup.classList.toggle("hide-popup"),
);

async function comment_submit_handler(tweet_id) {
  const comment_input = document.getElementById("comment_input");
  console.log(tweet_id);

  if (!comment_input.value.trim()) {
    comment_input.style = "border-color:red";
    return;
  }

  const response = await fetch("/user/post_comment", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: comment_input.value.trim(), tweet_id }),
  });

  if (response.ok) {
    console.log("comment inserted");
    document.getElementById("comment_count_" + tweet_id).innerHTML =
      parseInt(document.getElementById("comment_count_" + tweet_id).innerHTML) +
      1;
    const is_load = await show_comments(tweet_id);
  } else {
    const data = await response.json();
    alert(data.msg);
  }

  comment_input.value = "";
}
comment_input?.addEventListener(
  "focus",
  () => (comment_input.style = "border-color:;"),
);

async function fetch_comments(tweet_id) {
  const response = await fetch("/user/get_tweet_comments/" + tweet_id, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    const comments = data.comments;
    return comments;
    // console.log(comments)
  } else {
    const data = await response.json();
    console.log(data);
  }
  return null;
}

async function show_comments(tweet_id) {
  const comments = await fetch_comments(tweet_id);
  console.log(comments);

  const commentlist = document.getElementById("comment-list");
  commentlist.innerHTML = "";
  for (let i = 0; i < comments.length; i++) {
    commentlist.innerHTML += `
    <div class="user-item">
                    <div class="avatar">
                        <img style="width: 100%;height: 100%; border-radius: 50%;"
                            src="${comments[i].profile_picture}" alt="">
                    </div>
                    <div class="user-info">
                        <span class="username">
                            ${comments[i].username}
                        </span>
                        <span class="full-name">
                            ${comments[i].message.toString()}
                            ${console.log(comments[i].message)}
                        </span>
                    </div>
        </div>
            </div>
            
    `;
  }

  return true;
}

///////// retweet functionlity of tweet

const retweet_btn = document.querySelectorAll(".retweet-btn");

retweet_btn.forEach((btn) => {
  btn.addEventListener("click", async () => {
    console.log(btn.dataset.tweetid);
    if (btn.dataset.tweetid) {
      const response = await fetch("/user/insert_delete_retweet", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweet_id: btn.dataset.tweetid }),
      });

      const data = await response.json();
      if(response.ok){
        console.log(data.msg)
        const retweet_count = btn.lastElementChild
        if(data.msg == "retweet delete"){
          retweet_count.innerHTML = parseInt(retweet_count.innerHTML) - 1;
        }else{
          retweet_count.innerHTML = parseInt(retweet_count.innerHTML) + 1;
        }
      }else{
        alert(data.msg)
      }
    }
  });
});
