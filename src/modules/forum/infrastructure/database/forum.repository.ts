import { EntityRepository, ILike, In } from 'typeorm';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { BaseRepository } from '@core/database/base.repository';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(ForumEntity)
export class ForumRepository extends BaseRepository<ForumEntity> {
  findAll({ page, pageSize, search }: RequestQuery) {
    return this.findAndCount({
      relations: ['lastMessage', 'lastMessage.author', 'lastRedactedTheme'],
      where: {
        isDeleted: false,
        ...this.processSearchQuery(search),
      },
      order: { order: 'ASC' },
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findOrdered(order: 'ASC' | 'DESC') {
    return this.find({
      where: {
        isDeleted: false,
      },
      order: { order },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({
      where: {
        title,
        isDeleted: false,
      },
    }));
  }
}

@EntityRepository(ThemeEntity)
export class ThemeRepository extends BaseRepository<ThemeEntity> {
  findAll() {
    return this.find({
      where: {
        forum: {
          isDeleted: false,
        },
      },
      relations: ['forum'],
    });
  }

  findById(id: string) {
    return this.findOne({ where: { id }, relations: ['forum'] });
  }

  async findByForumId(id: string, { sort, page, pageSize, view, search }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    const sql = `
      SELECT *,
        (SELECT COUNT(*)
          FROM forum_message WHERE forum_message."themeId" = theme.id) as "messagesCount"
      FROM theme WHERE (forum_id = '${id}' OR "leavedLinks" ILIKE '%${id}%') AND (${this.processViewQueryRaw('theme', view)})
      ${sortKey && sortValue ? `ORDER BY ${sortKey} ${sortValue}` : `ORDER BY is_fixed DESC`}
      ${
        page && pageSize
          ? `
          OFFSET ${(Number(page) - 1) * Number(pageSize)}
          LIMIT ${Number(pageSize)}
         `
          : ''
      }
    `

    const messagesCountResult = await this.query(sql)

    const [themes, total] = await this.findAndCount({
      relations: ['author', 'lastMessage', 'lastMessage.author', 'forum'],
      where: [
        {
          forum: { id },
          ...this.processViewQuery(view),
          ...this.processSearchQuery(search),
        },
        {
          leavedLinks: ILike(`%${id}%`),
          ...this.processViewQuery(view),
          ...this.processSearchQuery(search),
        },
      ],
      order: { isFixed: 'DESC' },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });

    return [
      themes.map(theme => {
        const messagesCount = messagesCountResult.find(r => r.id === theme.id)?.messagesCount
        return {
          ...theme,
          totalMessages: messagesCount ?? theme.totalMessages
        }
      }),
      total
    ]
  }

  async isAlreadyExists(forumId: string, title: string) {
    return !!(await this.findOne({
      where: {
        forum: { id: forumId },
        title,
      },
      relations: ['forum'],
    }));
  }
}

@EntityRepository(ForumMessageEntity)
export class ForumMessageRepository extends BaseRepository<ForumMessageEntity> {
  findBySearch(search: string) {
    return this.find({
      where: { message: ILike(`%${search}%`) },
      relations: ['author', 'theme', 'theme.forum'],
    });
  }

  findByThemeId(id: string, { page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['author', 'theme'],
      where: { theme: { id } },
      order: {
        isFixed: 'DESC',
        createdAt: 'ASC',
      },
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['theme', 'theme.lastMessage'],
      where: { id },
    });
  }

  findTwoLastByThemeId(themeId: string) {
    return this.find({
      relations: ['theme'],
      where: {
        theme: { id: themeId },
      },
      order: { createdAt: 'DESC' },
      take: 2,
    });
  }

  findTwoLastByForumId(forumId: string) {
    return this.find({
      relations: ['theme', 'theme.forum'],
      where: { theme: { forum: { id: forumId } } },
      order: { createdAt: 'DESC' },
      take: 2,
    });
  }
}
