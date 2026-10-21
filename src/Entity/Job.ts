import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/job.json';

export default class Job extends AbstractApiEntity {
  static readonly entityName = 'job';

  static retrieveEntitySchema() {
    return schema;
  }
}
