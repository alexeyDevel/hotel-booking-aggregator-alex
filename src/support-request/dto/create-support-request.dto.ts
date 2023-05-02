import {ID} from "../../app/types/types";
import {Message} from "../schemas/message.schema";

export class CreateSupportRequestDto {
    readonly author: ID;
    readonly text: string;

    constructor(author: string, text: string) {
        this.author = author;
        this.text = text;
    }
}
