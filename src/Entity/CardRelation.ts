import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/card_relation.json';

export default class CardRelation extends AbstractApiEntity {
  static readonly entityName = 'cardRelation';

  static retrieveEntitySchema() {
    return schema;
  }
}
