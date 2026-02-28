import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/{{ENTITY_NAME}}.json';

export default class {{CLASS_NAME}} extends AbstractApiEntity {
  static readonly entityName = '{{ENTITY_NAME}}';

  static retrieveEntitySchema() {
    return schema;
  }
}
