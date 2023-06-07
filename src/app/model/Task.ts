import {Priority} from "./Priority";
import {Category} from "./Category";
import {CompleteType} from "./CompleteType";

export class Task {
  id: number;
  title: string;
  completeType: CompleteType;
  date?: Date;
  priority?: Priority;
  category?: Category;

  constructor(id: number, title: string, completeType: CompleteType, priority?: Priority, category?: Category, date?: Date) {
    this.id = id;
    this.title = title;
    this.completeType = completeType;
    this.priority = priority;
    this.category = category;
    this.date = date;
  }
}
