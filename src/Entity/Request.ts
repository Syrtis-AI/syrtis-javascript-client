import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/request.json';

export default class Request extends AbstractApiEntity {
  static readonly entityName = 'Request';

  static retrieveEntitySchema() {
    return schema;
  }
}
