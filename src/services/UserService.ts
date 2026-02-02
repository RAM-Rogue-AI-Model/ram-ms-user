import { CreateUserInput, UpdateUserQuery } from '../types/UserService';
import { prisma } from '../utils/mariaConnection';

class UserService {
  async create(data: CreateUserInput) {
    const dataSecured: CreateUserInput = { ...data };
    return prisma.user.create({ data: dataSecured });
  }

  async list() {
    return prisma.user.findMany();
  }
  async findByUsername(_username: string) {
    const username = _username.trim();
    return prisma.user.findMany({
      where: {
        username: username,
      },
    });
  }

  async getById(id: string) {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, data: UpdateUserQuery) {
    const dataSecured: UpdateUserQuery = { ...data };
    return prisma.user.update({
      where: {
        id: id,
      },
      data: dataSecured,
    });
  }
  async delete(id: string) {
    return prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}

export { UserService };
