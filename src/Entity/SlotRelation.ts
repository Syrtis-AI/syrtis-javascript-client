import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/slot_relation.json';

export default class SlotRelation extends AbstractApiEntity {
  static readonly entityName = 'slotRelation';

  static retrieveEntitySchema() {
    return schema;
  }
}
