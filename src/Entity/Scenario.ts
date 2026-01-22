import AbstractApiEntity, { type ApiEntityData } from '@wexample/js-api/Common/AbstractApiEntity';

export default class Scenario extends AbstractApiEntity {
  static readonly entityName = 'scenario';

  title?: string;

  constructor(data: ApiEntityData = {}) {
    super(data);
    this.title = data['title'] as string | undefined;
  }
}
