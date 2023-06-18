import {Priority} from "./Priority";
import {Category} from "./Category";
import {CompleteType} from "./CompleteType";
import {jsonIgnore} from "json-ignore";

export class Task {
  id: number;
  title: string;
  completeType: CompleteType;
  priority: Priority;
  category: Category;
  @jsonIgnore()
  oldCategory: Category;
  date?: Date;

  constructor(id: number, title: string, completeType: CompleteType, priority: Priority, category: Category, oldCategory: Category, date?: Date) {
    this.id = id;
    this.title = title;
    this.completeType = completeType;
    this.priority = priority;
    this.category = category;
    this.oldCategory = oldCategory;
    this.date = date;
  }
}
