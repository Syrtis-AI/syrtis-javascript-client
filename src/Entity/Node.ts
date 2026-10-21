import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/node.json';

export default class Node extends AbstractApiEntity {
  static readonly entityName = 'node';

  static retrieveEntitySchema() {
    return schema;
  }
}
