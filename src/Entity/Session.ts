import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';

export default class Session extends AbstractApiEntity {
  static readonly entityName = 'session';

  title?: string;
  dateCreated?: Date | null;
}
