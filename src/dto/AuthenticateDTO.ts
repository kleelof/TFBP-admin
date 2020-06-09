import User from "../models/UserModel";

export default class AuthenticateDTO {

    public refresh!: string;
    public access!: string;
    public id!: number;
    public email!: string;
    public user!: User
}