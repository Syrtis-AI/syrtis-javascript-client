import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/timezone.json';

export default class Timezone extends AbstractApiEntity {
  static readonly entityName = 'timezone';

  static retrieveEntitySchema() {
    return schema;
  }
}
