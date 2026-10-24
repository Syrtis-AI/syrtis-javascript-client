import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Timezone from '../Entity/Timezone.js';

export default class TimezoneRepository extends AbstractApiRepository<Timezone> {
  static getEntityType() {
    return Timezone;
  }
}
