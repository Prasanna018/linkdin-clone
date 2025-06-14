'use client';
import { IPostDocument } from '@/db/models/post'
import { SignedIn, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { MessageCircle, Repeat, Send, ThumbsUp } from 'lucide-react';
import { UNlikePostBody } from '@/app/api/post/[post_id]/unlike/route';
import CommentForm from './CommentFeed';
import CommentFeed from './CommentFeed';

interface LikeActionBody {
    id: string;
}

const PostOptions = ({ post }: { post: IPostDocument }) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const { user } = useUser();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes || []);

    useEffect(() => {
        if (user?.id && post.likes?.includes(user.id)) {
            setLiked(true);
        }
    }, [post, user]);

    const likeOrDislike = async () => {
        if (!user?.id) {
            throw new Error('User is unauthorized');
        }

        const originalLiked = liked;
        const originalLikes = likes;
        const newLikes = liked
            ? likes.filter((like) => like !== user.id)
            : [...(likes ?? []), user.id];

        const body: LikeActionBody | UNlikePostBody = {
            id: user.id
        };

        setLiked(!liked);
        setLikes(newLikes);

        try {
            // Like/Unlike action
            const response = await fetch(`/api/post/${post._id}/${liked ? 'unlike' : 'like'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to like or unlike the post');
            }

            // Fetch updated likes count
            const likesResponse = await fetch(`/api/post/${post._id}/like`);
            if (!likesResponse.ok) {
                throw new Error('Failed to get likes');
            }

            const newLikesData = await likesResponse.json();
            setLikes(newLikesData);

        } catch (error) {
            console.error('Error:', error);
            // Revert on error
            setLiked(originalLiked);
            setLikes(originalLikes);
        }
    };

    return (
        <div>
            <div className='flex justify-between p-4'>
                <div>
                    {likes.length > 0 && (
                        <p className='text-xs text-gray-500 cursor-pointer hover:underline'>
                            {likes.length} Likes
                        </p>
                    )}
                </div>
                <div>
                    {post.comments && post.comments.length > 0 && (
                        <p
                            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                            className='text-gray-400 text-xs cursor-pointer hover:underline'
                        >
                            {post.comments.length} comments
                        </p>
                    )}
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <Button
                    onClick={likeOrDislike}
                    variant='ghost'
                    className='cursor-pointer'
                >
                    <ThumbsUp
                        className={`${liked && 'text-blue-600 fill-[#0000FF]'}`}
                    />
                    Like
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                >
                    <MessageCircle className={`${isCommentsOpen && 'text-gray-600 fill-gray-600'}`} />
                    Comment
                </Button>
                <Button variant='ghost'>
                    <Repeat />
                    Repost
                </Button>
                <Button variant='ghost'>
                    <Send />
                    Send
                </Button>
            </div>

            {
                isCommentsOpen && (
                    <div className='p-4'>

                        {
                            (
                                <SignedIn>

                                    <CommentFeed post={post}></CommentFeed>
                                </SignedIn>
                            )
                        }
                    </div>

                )
            }
        </div>
    );
}

export default PostOptions;