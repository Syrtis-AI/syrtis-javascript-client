import AbstractApiEntity, { type ApiEntityData } from '@wexample/js-api/Common/AbstractApiEntity';

export default class Session extends AbstractApiEntity {
  static readonly entityName = 'session';

  title?: string;

  constructor(data: ApiEntityData = {}) {
    super(data);
    this.title = data['title'] as string | undefined;
  }
}
