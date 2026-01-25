import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import User from '../Entity/User';

export default class UserRepository extends AbstractApiRepository<User> {
  static getEntityType() {
    return User;
  }
}
