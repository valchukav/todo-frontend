import {Injectable} from '@angular/core';
import {PriorityDAO} from "../interface/PriorityDAO";
import {Priority} from "../../../model/Priority";
import {Observable} from "rxjs";
import {PrioritySearchValues} from "../search/SearchObjects";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PriorityServiceService implements PriorityDAO {

  url = 'http://localhost:8080/priority';

  constructor(private httpClient: HttpClient) {
  }

  add(t: Priority): Observable<Priority> {
    return this.httpClient.post<Priority>(this.url + '/add', t);
  }

  delete(id: number): Observable<Priority> {
    return this.httpClient.delete<Priority>(this.url + '/delete' + id);
  }

  get(id: number): Observable<Priority> {
    return this.httpClient.get<Priority>(this.url + '/id' + id);
  }

  getAll(): Observable<Priority[]> {
    return this.httpClient.get<Priority[]>(this.url + '/all');
  }

  search(searchValues: PrioritySearchValues): Observable<any> {
    return this.httpClient.post<Priority[]>(this.url + '/search', searchValues);
  }

  update(t: Priority): Observable<Priority> {
    return this.httpClient.put<Priority>(this.url + '/update', t);
  }
}
