import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function getPasswordHash(password: string) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return passwordHash;
}

export async function comparePassword(plainTextPassword: string, passwordHash: string) {
  const status = await bcrypt.compare(plainTextPassword, passwordHash);
  return status;
}

export async function hashData(data: string) {
  const hashedData = await bcrypt.hash(data, SALT_ROUNDS);
  return hashedData;
}
