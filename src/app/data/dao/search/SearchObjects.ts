import {CompleteType} from "../../../model/CompleteType";

export class CategorySearchValues {

  title: string = null;

  constructor(title: string) {
    this.title = title;
  }
}

export class PrioritySearchValues {

  title: string = null;

  constructor(title: string) {
    this.title = title;
  }
}

export class TaskSearchValues {

  title: string = null;
  completeType: CompleteType = null;
  priorityId: number = null;
  categoryId: number = null;

  pageNumber = 0;
  pageSize = 10;

  sortColumn: string;
  sortDirection: string;
}
