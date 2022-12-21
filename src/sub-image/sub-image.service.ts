import { HttpStatus, Injectable } from '@nestjs/common';
import { response } from 'express';

@Injectable()
export class SubImageService {
  create(subImgs: Array<Express.Multer.File>) {
    console.log(subImgs);
    return response.status(HttpStatus.OK).send('Hello');

    // return 'This action adds a new subImage';
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
