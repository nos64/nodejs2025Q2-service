import { User } from '@prisma/client';
import { UserResponse } from 'src/users/entities/user-response.entry';

export function excludePassword(user: User): UserResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, createdAt, updatedAt, ...rest } = user;
  return {
    ...rest,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
}
