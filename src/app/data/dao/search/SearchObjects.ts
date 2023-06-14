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

  pageNumber: number = 0;
  pageSize: number = 20;

  sortColumn: string = 'id';
  sortDirection: string = 'asc';

  constructor(title: string, completeType: CompleteType, priorityId: number, categoryId: number, pageNumber: number, pageSize: number, sortColumn: string, sortDirection: string) {
    this.title = title;
    this.completeType = completeType;
    this.priorityId = priorityId;
    this.categoryId = categoryId;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.sortColumn = sortColumn;
    this.sortDirection = sortDirection;
  }
}
