import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/card.json';

export default class Card extends AbstractApiEntity {
  static readonly entityName = 'card';

  static retrieveEntitySchema() {
    return schema;
  }
}
