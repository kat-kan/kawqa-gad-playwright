import { Headers } from '../interfaces/headers.interface';
import { ArticleData } from '@_src_api/interfaces/article-data.interface';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  private readonly url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    this.url = `/api/articles`;
  }

  public getRandomNumber(): number {
    return Math.floor(Math.random() * (2000 - 1001 + 1)) + 1001;
  }

  public async put(articleId: number, data: ArticleData): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }
}
