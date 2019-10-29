import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Googlefb {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    customId: string;

    @Column()
    name: string;

    @Column()
    email: string;
}
