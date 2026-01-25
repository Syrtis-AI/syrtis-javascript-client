import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import Scenario from '../Entity/Scenario.js';

export default class ScenarioRepository extends AbstractApiRepository<Scenario> {
  static getEntityType() {
    return Scenario;
  }
}
