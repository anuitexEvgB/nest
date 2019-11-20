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
<<<<<<< Updated upstream
=======

    @ApiModelProperty()
    latLng: {
        lat: number,
        lng: number,
    };

    @ApiModelProperty()
    userId: string;

    @ApiModelProperty()
    LiteId: number;

    @ApiModelProperty()
    PhotoId: [];
>>>>>>> Stashed changes
}
