import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Post } from '@/db/models/post';

const UserInformation = async () => {
    const user = await currentUser();




    return (
        <div className='flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4'>
            <Avatar>
                {
                    user?.id ?
                        (

                            <AvatarImage src={user?.imageUrl}></AvatarImage>
                        ) : (
                            <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                        )
                }
            </Avatar>

            <SignedIn>
                <div className='text-center'>
                    <p className='font-semibold'>
                        {user?.firstName}
                    </p>
                    <p className='text-xs'>
                        @{user?.firstName}
                        {user?.lastName}-{user?.id.slice(-4)}

                    </p>

                </div>
            </SignedIn>

            <SignedOut>
                <div className='text-center space-y-2'>
                    <p className='font-semibold'>You are not signed in</p>
                    <Button asChild
                        className='bg-blue-600 text-white'
                    >
                        <SignInButton>Sign in</SignInButton>

                    </Button>

                </div>
            </SignedOut>
            <hr className='my-5 w-full border-gray-200'></hr>

            <div className='flex  justify-between w-full px-4 text-sm'>
                <p className='font-semibold text-gray-400'>
                    Posts

                </p>
                <p className='text-blue-300'>
                    0
                </p>

            </div>
            <div className='flex  justify-between w-full px-4 text-sm'>
                <p className='font-semibold text-gray-400'>
                    Comments

                </p>
                <p className='text-blue-300'>
                    0
                </p>

            </div>
        </div>

    )
}

export default UserInformation
