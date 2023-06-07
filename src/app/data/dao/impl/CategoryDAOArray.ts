import {CategoryDAO} from "../interface/CategoryDAO";
import {Category} from "../../../model/Category";
import {Observable, of} from "rxjs";
import {TestData} from "../../TestData";

export class CategoryDAOArray implements CategoryDAO {

  add(t: Category): Observable<Category> {
    if (t.id == null || t.id === 0) {
      t.id = CategoryDAOArray.getLastIdCategory();
    }

    TestData.categories.push(t);

    return of(t);
  }

  private static getLastIdCategory(): number {
    return Math.max.apply(Math, TestData.categories.map(cat => cat.id)) + 1;
  }

  delete(id: number): Observable<Category> {
    TestData.tasks.forEach(task => {
      if (task.category && task.category.id === id) {
        task.category = null;
      }
    });

    const tmpCategory = TestData.categories.find(t => t.id === id);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory), 1);
    return of(tmpCategory);
  }

  get(id: number): Observable<Category> {
    return of(TestData.categories.find(cat => cat.id === id));
  }

  getAll(): Observable<Category[]> {
    return of(TestData.categories);
  }

  search(title: string): Observable<Category[]> {
    return of(
      TestData.categories
        .filter(cat => cat.title.toUpperCase().includes(title.toUpperCase()))
        .sort((c1, c2) => c1.title.localeCompare(c2.title))
    );
  }

  update(t: Category): Observable<Category> {
    const tmpCategory = TestData.categories.find(cat => cat.id === t.id);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory), 1, t);
    return of(t);
  }
}
