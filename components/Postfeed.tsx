import { IPostDocument } from '@/db/models/post'
import React from 'react'
import Post from './Post'

const Postfeed = ({ posts }: { posts: IPostDocument[] }) => {
    console.log(posts)
    return (
        <div className='space-y-2 mb-20'>
            {
                posts.map((post) => (
                    <Post key={post._id as string} post={post}   ></Post>
                ))
            }


        </div>
    )
}

export default Postfeed
