import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task} from "../../../model/Task";
import {Observable} from "rxjs";
import {CommonDAO} from "../interface/CommonDAO";

@Injectable({
  providedIn: 'root'
})
export class CommonService<T> implements CommonDAO<T> {

  private readonly url: string;

  constructor(url: string,
              private httpClient: HttpClient) {
    this.url = url;
  }

  add(t: T): Observable<Task> {
    return this.httpClient.post<T>(this.url + '/add', t);
  }

  delete(id: number): Observable<T> {
    return this.httpClient.delete<T>(this.url + '/delete/' + id);
  }

  get(id: number): Observable<T> {
    return this.httpClient.get<T>(this.url + '/id/' + id);
  }

  getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.url + '/all');
  }

  update(t: T): Observable<T> {
    return this.httpClient.put<T>(this.url + '/update', t);
  }
}
