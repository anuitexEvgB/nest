import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Photo {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    noteId: number;

    @Column()
    photo: string;
}
