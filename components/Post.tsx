'use client';
import { IPostDocument } from '@/db/models/post'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Avatar } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Trash2Icon } from 'lucide-react';
import TimeAgo from 'react-timeago'
import Image from 'next/image';
import { Button } from './ui/button';
import deletePostAction from '@/actions/deletePostAction';
import PostOptions from './PostOptions';

const Post = ({ post }: { post: IPostDocument }) => {
    const { user } = useUser();

    const isAuthor = user?.id === post.user.userId;
    // console.log(post)

    return (
        <div className='bg-white  rounded-xl border'>
            <div className='p-2 flex flex-col space-x-2'>
                <div className='flex justify-between w-full items-center'>
                    <div className='flex gap-x-4 items-center'>

                        <Avatar>
                            <AvatarImage
                                src={user?.imageUrl}
                            ></AvatarImage>
                        </Avatar>
                        <div className='flex flex-col items-start'>
                            <span>
                                {post.user.firstName}
                            </span>
                            <span className='text-xs text-black'>
                                @{user?.firstName}
                                {user?.lastName}-{user?.id.slice(-4)}
                            </span>
                            <span className='text-sm text-slate-400' >
                                <TimeAgo date={post.createdAt}></TimeAgo>
                            </span>

                        </div>
                    </div>

                    {
                        isAuthor && (
                            <Button
                                onClick={() => {
                                    const promise = deletePostAction(post._id as string)
                                }}
                                variant={'outline'} className='cursor-pointer'>
                                <Trash2Icon></Trash2Icon>
                            </Button>

                        )
                    }
                </div>

                <div className='mt-4' >
                    <span>{post.text}</span>

                </div>
                <div className='w-full p-2 mt-4'>
                    {
                        post.imageUrl && (
                            <Image
                                src={post?.imageUrl || ''}
                                alt='post'
                                height={500}
                                width={500}
                                className='w-full mx-auto'

                            >

                            </Image>
                        )
                    }

                </div>

            </div>

            <div className='p-2'>
                <PostOptions post={post}></PostOptions>
            </div>


        </div>
    )
}

export default Post
