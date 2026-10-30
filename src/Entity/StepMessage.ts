import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/step_message.json';

export default class StepMessage extends AbstractApiEntity {
  static readonly entityName = 'stepMessage';

  static retrieveEntitySchema() {
    return schema;
  }
}
