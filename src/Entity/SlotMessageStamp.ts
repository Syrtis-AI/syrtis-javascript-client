import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/slot_message_stamp.json';

export default class SlotMessageStamp extends AbstractApiEntity {
  static readonly entityName = 'slotMessageStamp';

  static retrieveEntitySchema() {
    return schema;
  }
}
