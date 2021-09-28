export class CreateUserDto {
  phone: string;
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  role: number;
}
