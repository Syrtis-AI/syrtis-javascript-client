import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/slot.json';

export default class Slot extends AbstractApiEntity {
  static readonly entityName = 'slot';

  static retrieveEntitySchema() {
    return schema;
  }
}
