import { getPosts } from '@/sanity/lib/post/getPosts';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import Post from './Post';

async function PostsList() {
  //Lets first get the user
  const user = await currentUser();

  //lets get the posts
  const posts = await getPosts();

  return (
    <div className='space-y-4'>
      {
        posts.map((post) => (
          <Post key={post._id} post={post} userId={user?.id || null} />
        ))
      }
    </div>
  )
}

export default PostsList