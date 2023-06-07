import {PriorityDAO} from "../interface/PriorityDAO";
import {Priority} from "../../../model/Priority";
import {Observable, of} from "rxjs";
import {TestData} from "../../TestData";

export class PriorityDAOArray implements PriorityDAO {

  add(t: Priority): Observable<Priority> {
    if (t.id == null || t.id === 0) {
      t.id = PriorityDAOArray.getLastIdPriority();
    }

    TestData.priorities.push(t);

    return of(t);
  }

  private static getLastIdPriority(): number {
    return Math.max.apply(Math, TestData.priorities.map(priority => priority.id)) + 1;
  }

  delete(id: number): Observable<Priority> {
    TestData.tasks.forEach(task => {
      if (task.priority && task.priority.id === id) {
        task.priority = null;
      }
    });

    const tmpPriority = TestData.priorities.find(t => t.id === id);
    TestData.priorities.splice(TestData.priorities.indexOf(tmpPriority), 1);
    return of(tmpPriority);
  }

  get(id: number): Observable<Priority> {
    return of(TestData.priorities.find(priority => priority.id === id));
  }

  getAll(): Observable<Priority[]> {
    return of(TestData.priorities);
  }

  update(t: Priority): Observable<Priority> {
    const tmpPriority = TestData.priorities.find(priority => priority.id === t.id);
    TestData.priorities.splice(TestData.priorities.indexOf(tmpPriority), 1, t);
    return of(t);
  }

}
