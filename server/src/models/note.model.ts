import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Note {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    completed: boolean;
}
