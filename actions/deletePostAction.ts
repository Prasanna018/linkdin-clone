'use server';


import { Post } from "@/db/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
    const user = await currentUser();


    if (user && !user?.id) {
        throw new Error('User not found')

    }

    const post = await Post.findById(postId)
    if (!post) {
        throw new Error('post not found')


    }
    if (post.user.userId !== user?.id) {
        throw new Error('Post not belongs to this user')

    }
    try {
        await post.removePost();
        revalidatePath('/')
    } catch (error) {
        console.log(error)

    }

}