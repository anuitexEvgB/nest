import { Entity, Column, ObjectIdColumn, ObjectID, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column()
    email: string;

    // @BeforeInsert()
    // hasPassword() {
    //     this.password = crypto.createHmac('sha256', this.password).digest('hex');
    // }

    @Column()
    password: string;
}
