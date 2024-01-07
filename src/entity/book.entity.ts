import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {UserBook} from "./userBook.entity";

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string;
    @OneToMany(() => UserBook, userBook => userBook.book)
    userBooks?: UserBook[];

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
