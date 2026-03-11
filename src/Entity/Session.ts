import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/session.json';

export default class Session extends AbstractApiEntity {
  static readonly entityName = 'Session';

  static retrieveEntitySchema() {
    return schema;
  }
}
