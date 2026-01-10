import AbstractApiRepository from "@wexample/js-api/Common/AbstractApiRepository";
import { type ApiEntityData } from "@wexample/js-api/Common/AbstractApiEntity";
import Document from "../Entity/Document";

export default class DocumentRepository extends AbstractApiRepository<Document> {
  static getEntityType() {
    return Document;
  }

  async fetchList(): Promise<Document[]> {
    const response = await this.client.get(this.buildPath('list')).json<{
      data?: { items?: ApiEntityData[] };
    }>();
    const items = response?.data?.items ?? [];

    if (!Array.isArray(items)) {
      return [];
    }

    return this.createFromApiCollection(items);
  }
}
