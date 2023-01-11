const cluster = require('src/core/libs/cluster');
import { cpus } from 'os';

const numWorkers = cpus().length === 1 ? 2 : cpus().length

export class Cluster {
  static run(callback: Function) {
    if (cluster.isPrimary) {
      for (let i = 0; i < numWorkers; i++) {
        cluster.fork()
      }

      cluster.on('exit', () => {
        cluster.fork()
      })
    } else {
      callback()
    }
  }
}