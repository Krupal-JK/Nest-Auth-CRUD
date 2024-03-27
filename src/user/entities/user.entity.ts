import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name : String;
    
    @Column()
    last_name: String;

    @Column()
    email: String
    
    @Column()
    age: number
    
}
