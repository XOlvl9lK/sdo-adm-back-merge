import { EntityRepository, In, Repository } from 'typeorm';
import { ApplicationSettingsEntity } from '@modules/application-settings/domain/application-settings.entity';

@EntityRepository(ApplicationSettingsEntity)
export class ApplicationSettingsRepository extends Repository<ApplicationSettingsEntity> {
  findByTitles(titles: string[]) {
    return this.find({
      where: {
        title: In(titles),
      },
    });
  }

  async isDataSeeded() {
    const settings = await this.findOne({
      where: { title: 'Is data seeded' }
    })
    return !!settings?.isActive
  }
}
