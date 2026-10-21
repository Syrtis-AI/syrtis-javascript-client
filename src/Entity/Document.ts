import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/document.json';

export default class Document extends AbstractApiEntity {
  static readonly entityName = 'document';

  static retrieveEntitySchema() {
    return schema;
  }
}
