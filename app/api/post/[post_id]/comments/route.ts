import connectDb from "@/db/connecDb";
import { ICommentbase } from "@/db/models/comment";
import { Post } from "@/db/models/post";
import { IUser } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { post_id: string } }) {
    await connectDb();
    try {
        const post = await Post.findById(params.post_id)
        if (!post) {
            return NextResponse.json({ error: "fot this post comments not found" }, { status: 404 })

        }

        const comments = await post.getAllComments();

        return NextResponse.json(comments);


    } catch (error) {

        return NextResponse.json({
            error: "an error occured in the getting the posts"
        }, { status: 500 })

    }




}

export interface CommentAddBody {
    user: IUser,
    text: string
}


export async function POST(req: NextRequest, { params }: { params: { post_id: string } }) {
    await connectDb();

    const { user, text }: CommentAddBody = await req.json();

    try {

        const post = await Post.findById(params.post_id)
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })

        }

        const comment: ICommentbase = {
            user,
            text
        }

        await post.commentOnPost(comment);
        return NextResponse.json({ message: "comment added successfully" })


    } catch (error) {
        return NextResponse.json({ error: "an error occured" }, { status: 500 })

    }

}