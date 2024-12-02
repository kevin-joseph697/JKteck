import { UsersEntity } from "src/entities/user.entities";

export class GetAllUserDto {
    id:number;
    email: string;
    roleId : string;
}

export function mapToGetAllUserDto(user: UsersEntity): GetAllUserDto {
    return {
        id: user.id,
        email: user.email, 
        roleId : user.roleId
    };
}