import { CreateUserInput } from '../types/UserService';
import { prisma } from '../utils/mariaConnection';

class UserService {
  async create(data: CreateUserInput) {
    const dataSecured: CreateUserInput = { ...data };
    return prisma.user.create({ data: dataSecured });
  }

  async list() {
    return prisma.user.findMany();
  }

  async findByUsenrame(_username: string) {
    const username = _username.trim();
    return prisma.user.findMany({
      where: {
        username: { equals: username },
      },
    });
  }
}

export { UserService };
