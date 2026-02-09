import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';

export default class Scenario extends AbstractApiEntity {
  static readonly entityName = 'scenario';

  title?: string;
  project?: string | null;
  dateCreated?: Date | null;
}
