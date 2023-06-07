import {CompleteType} from "../../../model/CompleteType";

export class CategorySearchValues {

  title: string = null;
}

export class PrioritySearchValues {

  title: string = null;
}

export class TaskSearchValues {

  title: string = null;
  completeType: CompleteType = null;
  priorityId: number = null;
  categoryId: number = null;

  pageNumber: number = 0;
  pageSize: number = 20;

  sortColumn: string = 'id';
  sortDirection: string = 'asc';
}
