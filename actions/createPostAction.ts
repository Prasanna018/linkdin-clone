
'use server';

import { AddPostRequestBody } from "@/app/api/post/route";
import { Post } from "@/db/models/post";

import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary, UploadStream, UploadApiResponse } from 'cloudinary';
import { revalidatePath } from "next/cache";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});
export default async function createPostAction(formData: FormData) {

    const user = await currentUser();
    if (!user) {
        throw new Error('User is not authenticated')
    }


    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;



    // define user //
    const userDb: IUser = {

        userId: user?.id || '',
        userImage: user?.imageUrl || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
    }

    //
    try {
        if (image.size > 0) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResponse: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        }
                        else {
                            resolve(result)
                        }
                    }
                );
                uploadStream.end(buffer)
            })
            const finalImageURL = uploadResponse?.secure_url as string;

            const body: AddPostRequestBody = {
                user: userDb,
                text: postInput,
                imageUrl: finalImageURL
            }

            await Post.create(body);

        } else {
            const body = {
                user: userDb,
                text: postInput
            }

            await Post.create(body);
        }

        revalidatePath('/')

    } catch (error) {

    }

}