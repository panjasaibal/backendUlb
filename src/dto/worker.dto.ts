class WorkerDto{
  id = "";
  supervisorId = "";
  name = "";
  phone = "";
  address?: string | null;
  aadhar: string = "";
  createdAt?: Date | null;
  updatedAt?: Date | null;

  constructor(data: Partial<WorkerDto> = {}) {
    Object.assign(this, data);
  }
}


export {
  WorkerDto,
};
