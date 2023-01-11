import { IOrderable } from '@core/domain/orderable.interface';
import { ViewQuery } from '@core/libs/types';
import { BaseException } from '@core/exceptions/base.exception';
import { filter, findIndex, orderBy } from 'lodash';

export type OrderDirection = 'UP' | 'DOWN';

export class ChangeOrderHelper {
  static changeOrder<T extends IOrderable>(
    elements: T[],
    targetId: string,
    direction: OrderDirection,
    view?: ViewQuery,
    archivedPath?: (element: T) => boolean,
  ) {
    if (!elements.length)
      BaseException.BadRequest(
        { name: 'ChangeOrderHelper', message: 'elements is empty' },
        'Невозможно изменить порядок',
      );
    const filtered = filter(elements, element => {
      let isArchived = element.isArchived;
      if (archivedPath) {
        isArchived = archivedPath(element);
      }
      switch (view) {
        case 'active':
          return !isArchived;
        case 'archive':
          return isArchived;
        case 'all':
          return true;
        default:
          return true;
      }
    });
    const sorted = orderBy(filtered, 'order');
    const targetIndex = findIndex(sorted, el => el.id == targetId);
    if (targetIndex < 0)
      BaseException.BadRequest(
        { name: 'ChangeOrderHelper', message: 'target element not found' },
        'Невозможно изменить порядок',
      );
    if (targetIndex === 0 && direction === 'UP')
      BaseException.BadRequest(
        { name: 'ChangeOrderHelper', message: 'target element is first' },
        'Невозможно изменить порядок',
      );
    if (targetIndex === elements.length - 1 && direction == 'DOWN')
      BaseException.BadRequest(
        { name: 'ChangeOrderHelper', message: 'target element is last' },
        'Невозможно изменить порядок',
      );
    const replacable = ChangeOrderHelper.findNextInArray(sorted, targetIndex, direction);
    const order = replacable.order;
    replacable.order = sorted[targetIndex].order;
    sorted[targetIndex].order = order;
  }

  private static findNextInArray(elements: IOrderable[], fromIndex: number, direction: OrderDirection) {
    if (direction === 'DOWN') {
      for (let i = fromIndex + 1; i < elements.length; i++) {
        return elements[i];
      }
    } else {
      for (let i = fromIndex - 1; i >= 0; i--) {
        return elements[i];
      }
    }
  }
}
