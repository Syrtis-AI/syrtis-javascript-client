import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';

export default class User extends AbstractApiEntity {
  static readonly entityName = 'user';

  username?: string;
  dateCreated?: Date | null;
  dateLastLogin?: Date | null;
  email?: string;
  firstName?: string;
  lastName?: string;
}
