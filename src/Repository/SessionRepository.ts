import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import Session from '../Entity/Session.js';

export default class SessionRepository extends AbstractApiRepository<Session> {
  static getEntityType() {
    return Session;
  }
}
