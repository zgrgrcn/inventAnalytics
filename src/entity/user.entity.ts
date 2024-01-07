import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {UserBook} from "./userBook.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string;
    @OneToMany(() => UserBook, userBook => userBook.user)
    userBooks?: UserBook[];

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
