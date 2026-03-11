import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/user.json';

export default class User extends AbstractApiEntity {
  static readonly entityName = 'User';

  static retrieveEntitySchema() {
    return schema;
  }
}
