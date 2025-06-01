import { UserResponse } from 'src/users/entities/user-response.entry';
import { User } from 'src/users/entities/user.entity';

export function excludePassword(user: User): UserResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}
