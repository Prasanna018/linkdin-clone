import { IUser } from "@/types/user";
import { IceCream } from "lucide-react";
import mongoose, { Schema, Document, models, Model, mongo } from "mongoose";

export interface ICommentbase {
    user: IUser,
    text: string
}

export interface IComment extends Document, ICommentbase {
    createdAt: Date,
    updatedAt: Date
}

const commentSchema = new Schema<IComment>({
    user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }

    },
    text: {
        type: String,
        required: true
    }

}, { timestamps: true });

export const Comment = models.Comment || mongoose.model<IComment>('Comment', commentSchema);
