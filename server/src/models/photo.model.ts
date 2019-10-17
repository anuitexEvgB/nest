import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Photo {
    @ObjectIdColumn()
    // tslint:disable-next-line: variable-name
    _id: string;

    @Column()
    noteId: string;

    @Column()
    photo: any;
}
