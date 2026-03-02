import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/message_stamp.json';

export default class MessageStamp extends AbstractApiEntity {
  static readonly entityName = 'message_stamp';

  static retrieveEntitySchema() {
    return schema;
  }
}
