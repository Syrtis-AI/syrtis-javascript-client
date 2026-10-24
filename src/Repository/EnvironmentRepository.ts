import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Environment from '../Entity/Environment.js';

export default class EnvironmentRepository extends AbstractApiRepository<Environment> {
  static getEntityType() {
    return Environment;
  }
}
