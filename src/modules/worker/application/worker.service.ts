import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
const Piscina = require('piscina');

@Injectable()
export class WorkerService {
  public pool = new Piscina({
    filename: resolve(__dirname, '..', 'infrastructure', 'main.worker.js')
  })

  public call(worker: string, args: any): void {
    this.pool.run(args, { name: worker })
  }

  public async asyncCall<Data = any>(worker: string, args?: any): Promise<Data> {
    return await this.pool.run(args, { name: worker })
  }
}