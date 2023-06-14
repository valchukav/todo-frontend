import {Inject, Injectable, InjectionToken} from '@angular/core';
import {TaskDAO} from "../interface/TaskDAO";
import {Observable} from "rxjs";
import {TaskSearchValues} from "../search/SearchObjects";
import {HttpClient} from "@angular/common/http";
import {Task} from "../../../model/Task";
import {CommonService} from "./common.service";

export const TASK_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CommonService<Task> implements TaskDAO {

  constructor(@Inject(TASK_URL_TOKEN) private baseUrl,
              private http: HttpClient) {
    super(baseUrl, http)
  }

  search(searchValues: TaskSearchValues): Observable<any> {
    return this.http.post<Task[]>(this.baseUrl + '/search', searchValues);
  }
}
