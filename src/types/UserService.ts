interface CreateUserInput {
    username:string;
    password:string;
    isAdmin:boolean;
    registration_date?: Date;
}

export { CreateUserInput };