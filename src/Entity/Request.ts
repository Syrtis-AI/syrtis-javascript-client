import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/request.json';

export default class Request extends AbstractApiEntity {
  static readonly entityName = 'request';

  static retrieveEntitySchema() {
    return schema;
  }
}
