import React from "react";

export function UpvoteButton({
  postId,
  upvoteCount,
  setPostUpvoteCount,
  userPostUpvoteCount,
  token,
}) {
  async function AddUpvote() {
    const upvoteUrl = `http://localhost:8090/api/posts/${postId}/upvote/`;
    const fetchConfigEvent = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(upvoteUrl, fetchConfigEvent);
    let responseJson = await response.json();
    console.log(responseJson);

    if (response.ok) {
      setPostUpvoteCount(responseJson.upvote_count, responseJson.user_upvoted);
    }
  }

  async function DeleteUpvote() {
    const deleteUpvoteUrl = `http://localhost:8090/api/posts/${postId}/upvote/`;
    const fetchConfigEvent = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(deleteUpvoteUrl, fetchConfigEvent);
    let responseJson = await response.json();

    //debugger;
    console.log(responseJson);
    if (response.ok) {
      setPostUpvoteCount(responseJson.upvote_count, responseJson.user_upvoted);
    }
  }
  console.log(userPostUpvoteCount);
  if (postId == 1) {
    //debugger;
  }
  return (
    <button
      style={
        userPostUpvoteCount <= 0
          ? { fontWeight: "normal" }
          : { fontWeight: "bold" }
      }
      onClick={userPostUpvoteCount <= 0 ? AddUpvote : DeleteUpvote}
    >
      {" "}
      {upvoteCount} upvotes
    </button>
  );
}
