import AbstractApiEntity, { type ApiEntityData } from '@wexample/js-api/Common/AbstractApiEntity';

export default class User extends AbstractApiEntity {
  static readonly entityName = 'user';

  username?: string;
  dateCreated?: Date | null;
  dateLastLogin?: Date | null;
  email?: string;
  firstName?: string;
  lastName?: string;

  constructor(data: ApiEntityData = {}) {
    super(data);
    this.username = data['username'] as string | undefined;
    this.dateCreated = this.parseDate(data['date_created']);
    this.dateLastLogin = this.parseDate(data['date_last_login']);
    this.email = data['email'] as string | undefined;
    this.firstName = data['first_name'] as string | undefined;
    this.lastName = data['last_name'] as string | undefined;
  }

  private parseDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
