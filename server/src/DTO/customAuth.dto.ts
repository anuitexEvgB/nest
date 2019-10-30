import { ObjectID } from 'typeorm';
export class CustomLoginDto {
    readonly id: ObjectID;
    readonly email: string;
    readonly name: string;
}
