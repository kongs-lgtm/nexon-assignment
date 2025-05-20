import { Logger } from '@nestjs/common';
import {
  ClientSession,
  Connection,
  FilterQuery,
  Model,
  SaveOptions,
  Types,
} from 'mongoose';

export abstract class AbstractRepository<T extends { _id: Types.ObjectId }> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<T>,
    protected readonly connection: Connection,
  ) {}

  async create(document: Omit<T, '_id'>, options?: SaveOptions): Promise<T> {
    const created = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    const result = await created.save(options);
    this.logger.log(`Created new ${this.model.modelName}: ${result._id}`);
    return result.toJSON() as T;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const document = await this.model.findOne(filter, {}, { lean: true });
    return document as T | null;
  }

  async find(filterQuery: FilterQuery<T>) {
    return (await this.model.find(filterQuery, {}, { lean: true })) as T[];
  }

  async findMany(
    filter: Partial<T>,
    options?: {
      limit?: number;
      skip?: number;
      sort?: { [key: string]: 1 | -1 };
    },
  ): Promise<T[]> {
    const documents = this.model.find(filter, {}, { lean: true });

    if (options?.limit) {
      documents.limit(options.limit);
    }

    if (options?.skip) {
      documents.skip(options.skip);
    }

    if (options?.sort) {
      documents.sort(options.sort);
    }

    return (await documents.exec()) as T[];
  }

  async createMany(
    documents: Omit<T, '_id'>[],
    session?: ClientSession,
  ): Promise<T[]> {
    const docsWithId = documents.map((doc) => ({
      ...doc,
      _id: new Types.ObjectId(),
    }));

    const result = await this.model.insertMany(docsWithId, {
      session,
      ordered: true,
    });

    this.logger.log(
      `Inserted ${result.length} ${this.model.modelName} documents`,
    );
    return result.map((doc) => doc.toJSON() as T);
  }
}
