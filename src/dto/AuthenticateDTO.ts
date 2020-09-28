import User from "../models/User";

export default class AuthenticateDTO {

    public refresh!: string;
    public access!: string;
    public id!: number;
    public email!: string;
    public user!: User;
    public operator_token!: string
}