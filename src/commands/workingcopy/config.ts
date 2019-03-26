import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("WorkingConfig")
export class WorkingConfig {
    @PrimaryGeneratedColumn({name: "id"})
    id!: number;

    @Column({name: "config"})
    config?: string;
}