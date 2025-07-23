import { Headers } from '../interfaces/headers.interface';
import { ArticleData } from '@_src_api/interfaces/article.interface';
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
    const currentTimeStamp = new Date();
    return currentTimeStamp.valueOf() * Math.random();
  }

  public async get(): Promise<APIResponse> {
    return await this.request.get(`${this.url}`, {
      headers: this.headers,
    });
  }

  public async getOne(articleId: number): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }

  public async post(data: ArticleData): Promise<APIResponse> {
    return await this.request.post(`${this.url}`, {
      headers: this.headers,
      data,
    });
  }

  public async put(articleId: number, data: ArticleData): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }
}
