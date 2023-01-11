import { Injectable } from '@nestjs/common';
import { GetBreadcrumbsDto } from '@modules/breadcrumbs/controllers/dto/get-breadcrumbs.dto';
import { getManager } from 'typeorm';
import { BreadcrumbResolver } from '@modules/breadcrumbs/infrastructure/BreadcrumbResolver';
import { forEachAsync } from '@core/libs/for-each-async';

@Injectable()
export class BreadcrumbsService {

  async getBreadcrumbs({ location }: GetBreadcrumbsDto) {
    const entityManager = getManager()
    const { matchResult, breadcrumbs, resolveHref, resolveLabel } = new BreadcrumbResolver(location)

    if (!matchResult) return []

    const response: { label: string, href: string }[] = []
    let matchParamsIteration = 0
    await forEachAsync(breadcrumbs, async breadcrumb => {
      if (Array.isArray(breadcrumb)) {
        response.push({ label: breadcrumb[0], href: resolveHref(breadcrumb[1]) })
      } else {
        let entity
        if (Array.isArray(breadcrumb.entity)) {
          await forEachAsync(breadcrumb.entity, async breadcrumbEntity => {
            const entityCandidate = await entityManager.findOne(breadcrumbEntity, {
              relations: breadcrumb.relations || [],
              where: {
                id: matchResult.params[matchParamsIteration]
              }
            })
            if (entityCandidate) entity = entityCandidate
          })
        } else {
          entity = await entityManager.findOne(breadcrumb.entity, {
            relations: breadcrumb.relations || [],
            where: {
              id: matchResult.params[matchParamsIteration]
            }
          })
        }
        response.push({
          label: resolveLabel(entity, breadcrumb),
          href: resolveHref(breadcrumb.href)
        })
        matchParamsIteration++
      }
    })

    return response
  }
}