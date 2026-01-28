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
    this.dateCreated = this.parseDate(data['dateCreated']);
    this.dateLastLogin = this.parseDate(data['dateLastLogin']);
    this.email = data['email'] as string | undefined;
    this.firstName = data['firstName'] as string | undefined;
    this.lastName = data['lastName'] as string | undefined;
  }

  private parseDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
