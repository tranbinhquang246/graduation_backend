import { Injectable } from '@nestjs/common';

@Injectable()
export class SubImageService {
  create() {
    return 'This action adds a new subImage';
  }

  findAll() {
    return `This action returns all subImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subImage`;
  }

  update(id: number) {
    return `This action updates a #${id} subImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} subImage`;
  }
}
