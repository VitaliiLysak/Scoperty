import { Injectable } from '@angular/core';
import {
  Meta,
  MetaDefinition,
  Title,
} from '@angular/platform-browser';

export interface SeoMeta {
  title: string;
  description: string;
  robots: string;
}

enum MetaName {
  Description = 'description',
  Robots = 'robots',
}

const DEFAULT_TITLE = 'Scoperty';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {}

  setMeta({ title, description, robots }: SeoMeta): void {
    this.titleService.setTitle(title);

    const tags: MetaDefinition[] = [
      { name: MetaName.Description, content: description },
      { name: MetaName.Robots, content: robots },
    ];
    this.meta.addTags(tags);
  }

  resetMeta(): void {
    this.titleService.setTitle(DEFAULT_TITLE);

    const tagNames: string[] = Object.values(MetaName);
    tagNames.forEach((tagName: string) => {
      this.meta.removeTag(`name = "${ tagName }"`);
    });
  }
}
