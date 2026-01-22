import type { ApiClientOptions } from '@wexample/js-api/Common/AbstractApiClient';
import AbstractApiEntitiesClient from '@wexample/js-api/Common/AbstractApiEntitiesClient';
import type { RepositoryClass } from '@wexample/js-api/Common/ApiEntityManager';
import ScenarioRepository from '../Repository/ScenarioRepository';
import SessionRepository from '../Repository/SessionRepository';
import UserRepository from '../Repository/UserRepository';

export default class SyrtisClient extends AbstractApiEntitiesClient {
  static readonly DEFAULT_BASE_URL = 'https://api.syrtis.ai/api/';

  constructor(options: ApiClientOptions = {}) {
    super({
      ...options,
      baseUrl: options.baseUrl ?? SyrtisClient.DEFAULT_BASE_URL,
    });
  }

  protected getRepositoryClasses(): RepositoryClass[] {
    return [ScenarioRepository, SessionRepository, UserRepository];
  }
}
