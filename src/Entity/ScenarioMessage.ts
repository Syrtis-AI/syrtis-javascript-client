import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/scenario_message.json';

export default class ScenarioMessage extends AbstractApiEntity {
  static readonly entityName = 'scenarioMessage';

  static retrieveEntitySchema() {
    return schema;
  }
}
