class SupervisorDto {
  id = "";
  adminId = "";
  name = "";
  phone = "";
  address: string | null = null;
  profile: string | null = null;
  aadhar: string = "";
  createdAt?: Date | null;
  updatedAt?: Date | null;

  constructor(data: Partial<SupervisorDto> = {}) {
    Object.assign(this, data);
  }
}

export {
  SupervisorDto
}


