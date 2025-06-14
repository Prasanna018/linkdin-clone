'use client'
import { useUser } from '@clerk/nextjs'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import Image from 'next/image';
import { ImageIcon, XIcon } from 'lucide-react';
import { formatMonthDropdown } from 'react-day-picker';
import createPostAction from '@/actions/createPostAction';


const PostForm = () => {
    const ref = useRef<HTMLFormElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { user } = useUser();

    const handlePostAction = async (formData: FormData) => {
        const formDataCopy = formData;
        ref.current?.reset();
        const text = formDataCopy.get('postInput') as string

        if (!text.trim()) {
            throw new Error('You must provide a post input')

        }

        setPreview(null);
        try {
            await createPostAction(formDataCopy);

        } catch (error) {
            console.log('error while creating a post', error);

        }



    }



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreview(URL.createObjectURL(file))


        }

    }
    // console.log(user)
    return (
        <div className='bg-white p-3'>
            <form ref={ref} action={(formData) => {
                handlePostAction(formData)
            }} >


                <div className='flex items-center space-x-2'>
                    <Avatar>
                        <AvatarImage
                            src={user?.imageUrl}

                        ></AvatarImage>
                        <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>

                    </Avatar>
                    <input

                        placeholder='Write a post'
                        name='postInput'
                        className='flex-1 bg-white rounded-xl outline-none py-3 px-4 border'
                    >
                    </input>
                    <input
                        ref={fileRef}
                        onChange={handleImageChange}
                        type='file'
                        hidden
                        accept='image/*'
                        name='image'

                    >
                    </input>
                    <Button type='submit'>
                        Post
                    </Button>

                </div>

                {/* preview image */}
                {
                    preview && (
                        <div className='mt-4'>
                            <img
                                height={200}
                                src={preview}
                                className='w-full rounded-lg h-1/2'
                            >
                            </img>
                        </div>
                    )
                }



                <div className='flex justify-end spacep-x-2 mt-2'>

                    <Button
                        onClick={() => fileRef.current?.click()}
                        type='button' className='mr-2' size={'sm'} color='currentColor'>
                        <ImageIcon></ImageIcon>
                        {preview ? "Change Image" : "Add Image"}
                    </Button>
                    {
                        preview && (<Button
                            variant={'outline'}
                            onClick={() => {
                                setPreview(null);
                                if (fileRef.current) {
                                    fileRef.current.value = '';
                                }
                            }}
                        >
                            <XIcon></XIcon>
                            Remove Image
                        </Button>)
                    }

                </div>

            </form>
            <hr className='border-2 w-full mt-2'></hr>

        </div>
    )
}

export default PostForm
