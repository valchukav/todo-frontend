import {Inject, Injectable, InjectionToken} from '@angular/core';
import {PriorityDAO} from "../interface/PriorityDAO";
import {Priority} from "../../../model/Priority";
import {Observable} from "rxjs";
import {PrioritySearchValues} from "../search/SearchObjects";
import {HttpClient} from "@angular/common/http";
import {CommonService} from "./common.service";

export const PRIORITY_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class PriorityService extends CommonService<Priority> implements PriorityDAO {

  constructor(@Inject(PRIORITY_URL_TOKEN) private baseUrl,
              private http: HttpClient) {
    super(baseUrl, http)
  }

  search(searchValues: PrioritySearchValues): Observable<any> {
    return this.http.post<Priority[]>(this.baseUrl + '/search', searchValues);
  }
}
