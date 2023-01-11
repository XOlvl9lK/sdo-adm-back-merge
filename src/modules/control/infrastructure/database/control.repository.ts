import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { RequestQuery } from '@src/core/libs/types';
import { Connection } from 'typeorm';
import { GetRegisteredReportDto } from 'src/modules/control/controllers/dtos/get-registered-report.dto';
import { BaseRepository } from '@src/core/database/base.repository';

export interface RegisteredPerformanceReportItem {
  id: string;
  regionTitle: string;
  departmentTitle: string;
  subdivisionTitle: string;
  groupTitle: string;
  groupCreatedAt: string;
  isGroupArchived: boolean;
  userCount: number;
  completedEducation: number;
  completedEducationPercentage: number;
  userAddedCountLastMonth: number;
  userAddedCountLastMonthPercentage: number;
  completedEducationLastMonth: number;
  completedEducationLastMonthPercentage: number;
  notCompletedEducation: number;
  notCompletedEducationPercentage: number;
}

@Injectable()
export class ControlRepository extends BaseRepository<unknown> {
  constructor(@InjectConnection() private connection: Connection) {
    super();
  }

  async getRegisteredReportPerformance(
    props: GetRegisteredReportDto,
    onlyIds: string[] = [],
  ): Promise<[RegisteredPerformanceReportItem[], number]> {
    const total = await this.getRegisteredReportPerformanceTotal(props);
    const { sort } = props;
    const sortEntries = Object.entries(JSON.parse(sort || '{}'));
    const { page, offset, pageSize } = props;
    let paginationParams = [];
    if ((page || offset !== undefined) && pageSize) {
      paginationParams = [
        Number(pageSize),
        offset !== undefined ? Number(offset) : (Number(page) - 1) * Number(pageSize),
      ];
    }
    const groupingQuery = this.getRegisteredReportPerformanceGroupingQuery(props);
    const query = `
      SELECT 
        "recordId" as "id",
        "regionTitle",
        "departmentTitle",
        "subdivisionTitle",
        "groupTitle",
        "userCount",
        "completedEducation",
        ROUND("completedEducation" / "userCount" * 100) as "completedEducationPercentage",
        "userAddedCountLastMonth",
        ROUND("userAddedCountLastMonth" / "userCount" * 100) as "userAddedCountLastMonthPercentage",
        "completedEducationLastMonth",
        ROUND("completedEducationLastMonth" / "userCount" * 100) as "completedEducationLastMonthPercentage",
        ("userCount" - "completedEducation") as "notCompletedEducation",
        ROUND(("userCount" - "completedEducation") / "userCount" * 100) as "notCompletedEducationPercentage",
        "groupCreatedAt",
        "isGroupArchived"
      FROM (
        SELECT
          "recordId",
          "regionTitle",
          "departmentTitle",
          "subdivisionTitle",
          "groupId",
          "groupTitle",
          "isGroupArchived",
          "user_ids",
          cardinality(user_ids) as "userCount",
          registered_report_performance_completed_education_count(user_ids) as "completedEducation",
          registered_report_performance_completed_education_count_by_last_month(user_ids) as "completedEducationLastMonth",
          registered_report_performance_registered_in_group_last_month("groupId", user_ids) as "userAddedCountLastMonth",
          (select "createdAt" from "group" where "id" = "groupId") as "groupCreatedAt"
        FROM (
          ${groupingQuery}
        ) as "groupingSelection"
      ) as "upperLevel"
      ${onlyIds.length ? `WHERE "recordId" IN (${onlyIds.map(e => `'${e}'`).join(', ')})` : ''}
      ${sortEntries.length ? `ORDER BY ${sortEntries.map(([key, value]) => `"${key}" ${value}`).join('\n')}` : ''}
      ${paginationParams.length ? `LIMIT ${paginationParams[0]} OFFSET ${paginationParams[1]}` : ''}
    `;
    const data: RegisteredPerformanceReportItem[] = await this.connection.query(query);
    return [data, total];
  }

  async getRegisteredReportPerformanceTotal(props: GetRegisteredReportDto) {
    const query = this.getRegisteredReportPerformanceGroupingQuery(props);
    const result = await this.connection.query(`
      SELECT COUNT(*) as "count" FROM (${query}) as "groupingSelection"
    `);
    const { count } = result[0];
    return count;
  }

  private getRegisteredReportPerformanceGroupingQuery(props: GetRegisteredReportDto) {
    const { dateStart, dateEnd, groupDateStart, groupDateEnd, groupIds } = props;
    let idArray: string[] = [];
    if (groupIds) idArray = Array.isArray(groupIds) ? groupIds : [groupIds];
    const query = `
      SELECT
        (
          COALESCE("reg"."id", 'empty') || '-' || COALESCE("dep"."id", 'empty') || '-' || COALESCE("sd"."id", 'empty') || '-' || COALESCE("groupId", 'empty')
        ) as "recordId",
        "groupId",
        "g"."title" as "groupTitle",
        "g"."isArchived" as "isGroupArchived",
        "dep"."title" as "departmentTitle",
        "reg"."title" as "regionTitle",
        "sd"."title" as "subdivisionTitle",
        (array_agg("userId"))::text[] as user_ids
      FROM (
        SELECT 
          "groupId",
          "userId"
        FROM 
          "user_in_group_entity" as "uig"
        LEFT JOIN "group" as "g" ON "g"."id" = "uig"."groupId"
        LEFT JOIN "user" as "u" ON "u"."id" = "uig"."userId"
        WHERE TRUE
        ${groupDateStart ? `AND '${this.getLowerDateLimit(groupDateStart)}' <= "g"."createdAt"` : ''}
        ${groupDateEnd ? `AND "g"."createdAt" <= '${this.getUpperDateLimit(groupDateEnd)}'` : ''}
        ${dateStart ? `AND '${this.getLowerDateLimit(dateStart)}' <= "u"."createdAt"` : ''}
        ${dateEnd ? `AND "u"."createdAt" < '${this.getUpperDateLimit(dateEnd)}'` : ''}
        ${idArray.length ? `AND "groupId" IN (${idArray.map(e => `'${e}'`).join(',')})` : ''}
      ) as "userInGroupSelection"
      
      LEFT JOIN "group" as "g" ON "g"."id" = "userInGroupSelection"."groupId"
      LEFT OUTER JOIN "user" as "u" ON "u"."id" = "userInGroupSelection"."userId"
      LEFT OUTER JOIN "department" as "dep" ON "dep"."id" = "u"."departmentId"
      LEFT OUTER JOIN "region" as "reg" ON "reg"."id" = "u"."regionId"
      LEFT OUTER JOIN "subdivision" as "sd" ON "sd"."id" = "u"."subdivisionId"

      GROUP BY
        "groupId",
        "g"."title",
        "g"."isArchived",
        "dep"."id",
        "dep"."title",
        "reg"."id",
        "reg"."title",
        "sd"."id",
        "sd"."title"
    `;

    return query;
  }
}
