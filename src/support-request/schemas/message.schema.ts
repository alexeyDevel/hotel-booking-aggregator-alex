import mongoose, {Document, model} from 'mongoose';
import {ID} from "../../app/types/types";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    sentAt: Date;

    @Prop({ required: true })
    text: string;

    @Prop()
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export const MessageModel = model('Message', MessageSchema);
