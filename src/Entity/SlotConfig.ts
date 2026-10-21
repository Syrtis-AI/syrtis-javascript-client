import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/slot_config.json';

export default class SlotConfig extends AbstractApiEntity {
  static readonly entityName = 'slotConfig';

  static retrieveEntitySchema() {
    return schema;
  }
}
