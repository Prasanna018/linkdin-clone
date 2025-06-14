import { IPostDocument } from '@/db/models/post'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

const CommentFeed = ({ post }: { post: IPostDocument }) => {
    const { user } = useUser();
    const isAuthor = user?.id === post.user.userId


    return (
        <div>
            {
                post.comments?.map((comment) => (
                    <div key={comment.id} className='flex space-x-1'>
                        <Avatar>
                            <AvatarImage
                                src={comment.user.userImage}
                            ></AvatarImage>
                            <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className='bg-gray-200 px-4 rounded-md w-full sm:w-auto md:min-w-[300px]'>

                            <div>
                                <p className='font-semibold'>
                                    {
                                        comment.user.firstName
                                    }
                                    {comment.user.lastName}
                                    {' '}
                                    <Badge>{isAuthor && 'Author'}</Badge>
                                </p>
                            </div>

                        </div>

                    </div>






                )

                )
            }

        </div>
    )
}

export default CommentFeed
