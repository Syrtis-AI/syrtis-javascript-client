import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/step.json';

export default class Step extends AbstractApiEntity {
  static readonly entityName = 'step';

  static retrieveEntitySchema() {
    return schema;
  }
}
