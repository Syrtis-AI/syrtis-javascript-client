import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import ScenarioMessage from '../Entity/ScenarioMessage.js';

export default class ScenarioMessageRepository extends AbstractApiRepository<ScenarioMessage> {
  static getEntityType() {
    return ScenarioMessage;
  }
}

