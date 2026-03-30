import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import Request from '../Entity/Request.js';

export default class RequestRepository extends AbstractApiRepository<Request> {
  static getEntityType() {
    return Request;
  }
}
