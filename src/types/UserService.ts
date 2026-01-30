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

export { CreateUserInput, RegisterUserBody };
