import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Photo {
    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    noteId: number;

    @Column()
    photo: string;
}
