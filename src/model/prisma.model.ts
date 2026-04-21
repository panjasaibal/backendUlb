class PrismaQueryResult<T = any> implements PromiseLike<T> {
  constructor(
    private readonly modelName: string,
    private readonly operation: string,
  ) {}

  private buildError(): Error {
    return new Error(
      `${this.modelName}.${this.operation} is still using a temporary compatibility stub. Move this query to Prisma client usage in the service layer.`,
    );
  }

  lean(): Promise<T> {
    return Promise.reject(this.buildError());
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.reject<T>(this.buildError()).then(onfulfilled, onrejected);
  }
}

class PrismaModel {
  constructor(data: Record<string, unknown> = {}) {
    Object.assign(this, data);
  }

  toJSON(): Record<string, unknown> {
    return Object.assign({}, this) as Record<string, unknown>;
  }

  protected static unsupportedError(operation: string): Error {
    return new Error(
      `${this.name}.${operation} is not backed by Prisma yet. Update the service layer to use prisma.${this.name} instead.`,
    );
  }

  static find(_where?: unknown): PrismaQueryResult<any[]> {
    return new PrismaQueryResult<any[]>(this.name, "find");
  }

  static findOne(_where?: unknown): PrismaQueryResult<any> {
    return new PrismaQueryResult<any>(this.name, "findOne");
  }

  static findById(_id: string): PrismaQueryResult<any> {
    return new PrismaQueryResult<any>(this.name, "findById");
  }

  static findOneAndUpdate(
    _where?: unknown,
    _data?: unknown,
    _options?: unknown,
  ): PrismaQueryResult<any> {
    return new PrismaQueryResult<any>(this.name, "findOneAndUpdate");
  }

  static findByIdAndUpdate(
    _id: string,
    _data?: unknown,
    _options?: unknown,
  ): PrismaQueryResult<any> {
    return new PrismaQueryResult<any>(this.name, "findByIdAndUpdate");
  }

  static findOneAndDelete(_where?: unknown): PrismaQueryResult<any> {
    return new PrismaQueryResult<any>(this.name, "findOneAndDelete");
  }

  static findByIdAndDelete(_id: string): PrismaQueryResult<any> {
    return new PrismaQueryResult<any>(this.name, "findByIdAndDelete");
  }

  static create(_data?: unknown): Promise<any> {
    return Promise.reject(this.unsupportedError("create"));
  }

  static deleteMany(_where?: unknown): Promise<{ count: number }> {
    return Promise.reject(this.unsupportedError("deleteMany"));
  }
}

export { PrismaModel };
