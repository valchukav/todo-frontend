import { Injectable } from '@angular/core';
import {CategoryDAO} from "../interface/CategoryDAO";
import {Category} from "../../../model/Category";
import {Observable} from "rxjs";
import {CategorySearchValues} from "../search/SearchObjects";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService implements CategoryDAO{

  url = 'http://localhost:8080/category';

  constructor(private httpClient: HttpClient) { }

  add(t: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.url + '/add', t);
  }

  delete(id: number): Observable<Category> {
    return this.httpClient.delete<Category>(this.url + '/delete' + id);
  }

  get(id: number): Observable<Category> {
    return this.httpClient.get<Category>(this.url + '/id' + id);
  }

  getAll(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.url + '/all');
  }

  search(searchValues: CategorySearchValues): Observable<any> {
    return this.httpClient.post<Category[]>(this.url + '/search', searchValues);
  }

  update(t: Category): Observable<Category> {
    return this.httpClient.put<Category>(this.url + '/update', t);
  }
}
