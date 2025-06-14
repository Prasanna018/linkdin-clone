import connectDb from "@/db/connecDb";
import { Post } from "@/db/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { post_id: string } }) {
    await connectDb();
    const postId = await params.post_id
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }
        const likes = post.likes
        return NextResponse.json(likes)
    } catch (error) {
        return NextResponse.json({
            error: "an error occured in getting liked posts"
        }, { status: 500 })

    }

}


export interface LikePostBody {
    id: string

}

export async function POST(req: NextRequest, { params }: { params: { post_id: string } }) {
    await connectDb();

    const { id }: LikePostBody = await req.json();
    const postId = (await params).post_id
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({
                error: "error occured in liking the post or post not found"
            }, { status: 404 })
        }

        await post.likePost(id);

        return NextResponse.json({
            message: "Post liked succesfully"
        })


    } catch (error) {
        return NextResponse.json({
            error: "an error occured in  liking the  posts"
        }, { status: 500 })

    }

}