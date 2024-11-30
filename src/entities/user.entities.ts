import { Column, Model, Table, DataType, AutoIncrement, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { RoleEntity } from './role.entities';

@Table({ tableName: 'tblUsers' })
export class UsersEntity extends Model<UsersEntity> {
 @AutoIncrement
 @PrimaryKey
 @Column({
    type:DataType.INTEGER
 })
 id:number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ForeignKey(() => RoleEntity)
  @Column(DataType.UUID)
  roleId: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
