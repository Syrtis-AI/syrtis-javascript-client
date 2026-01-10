import AbstractApiEntity, { type ApiEntityData } from "@wexample/js-api/Common/AbstractApiEntity";

export default class Document extends AbstractApiEntity {
  static readonly entityName = 'document';

  title?: string;

  constructor(data: ApiEntityData = {}) {
    super(data);
    this.title = data['title'] as string | undefined;
  }
}
