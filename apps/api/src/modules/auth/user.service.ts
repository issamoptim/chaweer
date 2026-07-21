import { prisma } from '../../core/database/prisma';
import type { Prisma, PrismaClient } from '../../generated/prisma/client';

type PrismaTx = Prisma.TransactionClient | PrismaClient;

export async function updateIdentity(
  userId: string,
  data: { firstName?: string; lastName?: string },
  tx: PrismaTx = prisma,
): Promise<void> {
  const updateData: Prisma.UserUpdateInput = {};
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;

  if (Object.keys(updateData).length > 0) {
    await tx.user.update({ where: { id: userId }, data: updateData });
  }
}
