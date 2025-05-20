import { ClientSession, Connection } from 'mongoose';

export async function runWithTransaction<T>(
  connection: Connection,
  handler: (session: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await connection.startSession();
  session.startTransaction();

  try {
    const result = await handler(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}
