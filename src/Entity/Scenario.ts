import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/scenario.json';

export default class Scenario extends AbstractApiEntity {
  static readonly entityName = 'scenario';

  static retrieveEntitySchema() {
    return schema;
  }
}
