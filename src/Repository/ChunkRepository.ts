import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Chunk from '../Entity/Chunk.js';

export default class ChunkRepository extends AbstractApiRepository<Chunk> {
  static getEntityType() {
    return Chunk;
  }
}
