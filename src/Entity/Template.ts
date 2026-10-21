import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/template.json';

export default class Template extends AbstractApiEntity {
  static readonly entityName = 'template';

  static retrieveEntitySchema() {
    return schema;
  }
}
