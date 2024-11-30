import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersEntity } from "./user.entities";

@Table
export class DocumentEntity extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column({
        type:DataType.INTEGER
    })
    id:number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      title: string;
    
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      description: string;
    
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      filePath: string;

      @ForeignKey(()=>UsersEntity)
      @Column({
        type:DataType.INTEGER,
        allowNull: false,
     })
     userId:number;
}