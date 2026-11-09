import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Step from '../Entity/Step.js';

export default class StepRepository extends AbstractApiRepository<Step> {
  static getEntityType() {
    return Step;
  }
}
