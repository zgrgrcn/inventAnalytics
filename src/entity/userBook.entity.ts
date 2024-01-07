import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Book} from "./book.entity";

@Entity()
export class UserBook extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true})
    score?: number;

    @Column()
    status!: 'past' | 'present';

    @ManyToOne(() => User, user => user.userBooks, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userid'})
    user!: User;

    @ManyToOne(() => Book, book => book.userBooks, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'bookid'})
    book!: Book;
}
