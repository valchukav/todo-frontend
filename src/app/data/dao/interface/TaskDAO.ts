import {CommonDAO} from "./CommonDAO";
import {Task} from "../../../model/Task";
import {Observable} from "rxjs";
import {TaskSearchValues} from "../search/SearchObjects";

export interface TaskDAO extends CommonDAO<Task> {

  search(searchValues: TaskSearchValues): Observable<any>;
}
