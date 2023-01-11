import { Entity } from 'typeorm';
import { ContentEntity } from '@core/domain/content.entity';

@Entity('chapter')
export class ChapterEntity extends ContentEntity {
  constructor(title: string, description?: string) {
    super(title, description);
  }

  update(title: string, description?: string) {
    this.title = title.trim();
    this.description = description ? description.trim() : null;
  }
}
