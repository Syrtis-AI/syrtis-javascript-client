import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/slot_message.json';

export default class SlotMessage extends AbstractApiEntity {
  static readonly entityName = 'slotMessage';

  static retrieveEntitySchema() {
    return schema;
  }
}
