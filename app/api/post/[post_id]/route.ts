import connectDb from "@/db/connecDb";
import { Post } from "@/db/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { post_id: string } }) {
    await connectDb();

    try {
        const post = await Post.findById(params.post_id);

        if (!post) {
            return NextResponse.json({
                error: "Can't find the post"
            }, { status: 404 })
        }
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({
            error: 'An error occured while geting post'
        }, { status: 500 })
    }
}

export interface DeletePostReqBody {
    id: string
}


export async function DELETE(req: NextRequest, { params }: { params: { post_id: string } }) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }
    const { id }: DeletePostReqBody = await req.json();


    try {

        await connectDb();
        const post = await Post.findById(params.post_id);
        if (!post) {
            return NextResponse.json({
                error: "Getting error while deleting post"
            }, { status: 404 })
        };


        if (post.user.userId !== id) {
            throw new Error('post does not belong to this user')
        };


        await post.removePost();

    } catch (error) {
        return NextResponse.json({
            error: 'An error occured while deleting the post'
        }, { status: 500 });

    }

}