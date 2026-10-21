import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/environment.json';

export default class Environment extends AbstractApiEntity {
  static readonly entityName = 'environment';

  static retrieveEntitySchema() {
    return schema;
  }
}
