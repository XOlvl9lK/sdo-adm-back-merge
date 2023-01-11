// Сущности, у которых можно изменять порядок
export interface IOrderable {
  id: string;
  order: number;
  isArchived: boolean;
}
