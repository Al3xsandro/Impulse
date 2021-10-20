import { IsNotEmpty } from "class-validator";

export class CreateMessageDTO {
    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    user_id: string;
}