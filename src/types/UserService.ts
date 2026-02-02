interface CreateUserInput {
  username: string;
  password: string;
  isAdmin: boolean;
  registration_date?: Date;
}

interface RegisterUserBody {
  username: string;
  password: string;
  confirmPassword?: string;
}

interface UpdateUserBody {
  id: string;
  password: string;
  username?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface UpdateUserQuery {
  username?: string;
  password?: string;
}

export { CreateUserInput, RegisterUserBody, UpdateUserBody, UpdateUserQuery };
