import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import StepMessage from '../Entity/StepMessage.js';

export default class StepMessageRepository extends AbstractApiRepository<StepMessage> {
  static getEntityType() {
    return StepMessage;
  }
}
