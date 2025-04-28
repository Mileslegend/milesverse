import { GetAllPostsQueryResult } from '@/sanity.types'
import React from 'react'

interface PostProps {
    post: GetAllPostsQueryResult[number];
    userId: string | null;
}

async function Post( {post, userId}: PostProps ) {

    //const votes = await getPostVotes(post._id);
    //const vote = await getUserPostVoteStatus(post._id, userId);
    //const comments = await getPostComments(post._id, userId);

  return (
    <div>Post</div>
  )
}

export default Post