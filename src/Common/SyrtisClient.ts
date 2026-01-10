import { type ApiClientOptions } from "@wexample/js-api/Common/AbstractApiClient";
import SyrtisEntitiesClient from "./SyrtisEntitiesClient";

export default class SyrtisClient extends SyrtisEntitiesClient {
  constructor(options: ApiClientOptions = {}) {
    super(options);
  }
}
