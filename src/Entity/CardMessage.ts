import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/card_message.json';

export default class CardMessage extends AbstractApiEntity {
  static readonly entityName = 'cardMessage';

  static retrieveEntitySchema() {
    return schema;
  }
}
