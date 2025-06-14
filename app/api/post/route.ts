import connectDb from "@/db/connecDb";
import { IPostsbase, Post } from "@/db/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export interface AddPostRequestBody {
    user: IUser,
    text: string,
    imageUrl?: string | null
}

export async function POST(req: NextRequest) {

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await connectDb();

        const { user, text, imageUrl }: AddPostRequestBody = await req.json();

        const postData: IPostsbase = {
            user,
            text,
            ...(imageUrl && { imageUrl })
        }
        const post = await Post.create(postData);



    } catch (error) {

    }

}


export async function GET(req: NextRequest) {
    try {

        await connectDb();
        const posts = await Post.getAllPosts();
        return NextResponse.json({ posts })

    } catch (error) {
        return NextResponse.json({
            error: "An error occured while fetching posts"
        }, { status: 500 })

    }


}