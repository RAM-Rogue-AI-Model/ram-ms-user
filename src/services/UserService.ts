import { prisma } from "../utils/mariaConnection";
import { CreateUserInput } from "../types/UserService";

class UserService {
    constructor(){}

    async create(data: CreateUserInput) {
        const dataSecured:CreateUserInput = {...data}
        return prisma.user.create({ data: dataSecured });
    }

    async list() {
        return prisma.user.findMany();
    }

    async findByUsenrame(_username:string) {
        const username = _username.trim()
        return prisma.user.findMany({
            where: {
                username: {equals : username}
            },
        });
    }
}

export { UserService }