import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models, Model, model } from "mongoose";
import { Comment, IComment, ICommentbase } from "./comment";

export interface IPostsbase {
    user: IUser,
    text: string,
    imageUrl?: string,
    comments?: IComment[],
    likes?: string[],
}

export interface IPost extends IPostsbase, Document {
    createdAt: Date,
    updatedAt: Date
}

interface IPostMethod {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentbase): Promise<void>;
    getAllComments(): Promise<void>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethod { }
interface IPostModel extends IPostStatics, Model<IPostDocument> { }

const PostSchema = new Schema<IPostDocument>({
    user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String }
    },
    text: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment",
        default: []
    },
    likes: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,

});

PostSchema.methods.likePost = async function (userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId } });
    } catch (error) {
        console.log('error while liking post', error);
        throw error;
    }
};

PostSchema.methods.unlikePost = async function (userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } });
    } catch (error) {
        console.log('error while unliking post', error);
        throw error;
    }
};

PostSchema.methods.removePost = async function () {
    try {
        await this.model('Post').deleteOne({ _id: this._id });
    } catch (error) {
        console.log('error in removing post ', error);
        throw error;
    }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentbase) {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comments.push(comment._id);  // Fixed from 'comment' to 'comments'
        await this.save();
    } catch (error) {
        console.log('error while commenting to post', error);
        throw error;
    }
};

PostSchema.methods.getAllComments = async function () {
    try {
        await this.populate({
            path: "comments",  // Fixed from 'Comment' to 'comments'
            options: { sort: { createdAt: -1 } }
        });
        return this.comments;
    } catch (error) {
        console.log('error while getting comments', error);
        throw error;
    }
};

PostSchema.statics.getAllPosts = async function () {
    try {
        const posts = await this.find().sort({ createdAt: -1 })
            .populate({
                path: "comments",  // Fixed from 'comment' to 'comments'
                options: { sort: { createdAt: -1 } }
            })
            .lean();

        return posts.map((post: IPostDocument) => ({
            ...post,
            _id: String(post._id),
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                _id: String(comment._id)
            })),
        }));
    } catch (error) {
        console.log('error while getting posts', error);
        throw error;
    }
};

export const Post = models.Post as IPostModel ||
    model<IPostDocument, IPostModel>('Post', PostSchema);