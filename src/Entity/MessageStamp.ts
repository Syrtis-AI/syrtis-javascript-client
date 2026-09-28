import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/message_stamp.json';

export default class MessageStamp extends AbstractApiEntity {
  static readonly entityName = 'messageStamp';

  static retrieveEntitySchema() {
    return schema;
  }
}
