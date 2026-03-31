import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/message.json';

export default class Message extends AbstractApiEntity {
  static readonly entityName = 'message';

  static retrieveEntitySchema() {
    return schema;
  }
}
