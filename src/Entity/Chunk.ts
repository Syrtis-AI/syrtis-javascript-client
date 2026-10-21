import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/chunk.json';

export default class Chunk extends AbstractApiEntity {
  static readonly entityName = 'chunk';

  static retrieveEntitySchema() {
    return schema;
  }
}
