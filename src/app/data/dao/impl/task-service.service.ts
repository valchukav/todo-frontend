import {Injectable} from '@angular/core';
import {TaskDAO} from "../interface/TaskDAO";
import {Observable} from "rxjs";
import {TaskSearchValues} from "../search/SearchObjects";
import {HttpClient} from "@angular/common/http";
import {Task} from "../../../model/Task";

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService implements TaskDAO {

  url = 'http://localhost:8080/task';

  constructor(private httpClient: HttpClient) {
  }

  add(t: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.url + '/add', t);
  }

  delete(id: number): Observable<Task> {
    return this.httpClient.delete<Task>(this.url + '/delete' + id);
  }

  get(id: number): Observable<Task> {
    return this.httpClient.get<Task>(this.url + '/id' + id);
  }

  getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.url + '/all');
  }

  search(searchValues: TaskSearchValues): Observable<any> {
    return this.httpClient.post<Task[]>(this.url + '/search', searchValues);
  }

  update(t: Task): Observable<Task> {
    return this.httpClient.put<Task>(this.url + '/update', t);
  }
}
