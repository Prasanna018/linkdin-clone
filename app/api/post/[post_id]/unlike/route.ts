import connectDb from "@/db/connecDb";
import { Post } from "@/db/models/post";
import { NextRequest, NextResponse } from "next/server";

export interface UNlikePostBody {
    id: string;
}

export async function POST(
    req: NextRequest,
    { params }: { params: { post_id: string } }
) {
    try {
        await connectDb();
        const { id }: UNlikePostBody = await req.json();
        const postId = (await params).post_id; // No need to await params

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found for unlike" },
                { status: 404 }
            );
        }

        await post.unlikePost(id);
        return NextResponse.json(
            { success: "Post unliked successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error unliking post:", error);
        return NextResponse.json(
            { error: "An error occurred while unliking the post" },
            { status: 500 }
        );
    }
}