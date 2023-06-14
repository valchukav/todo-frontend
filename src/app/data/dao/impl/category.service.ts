import {Inject, Injectable, InjectionToken} from '@angular/core';
import {CategoryDAO} from "../interface/CategoryDAO";
import {Category} from "../../../model/Category";
import {HttpClient} from "@angular/common/http";
import {CommonService} from "./common.service";
import {CategorySearchValues} from "../search/SearchObjects";
import {Observable} from "rxjs";

export const CATEGORY_URL_TOKEN = new InjectionToken<string>('url');


@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CommonService<Category> implements CategoryDAO {

  constructor(@Inject(CATEGORY_URL_TOKEN) private baseUrl: string,
              private http: HttpClient) {
    super(baseUrl, http)
  }

  search(searchValues: CategorySearchValues): Observable<any> {
    return this.http.post<Category[]>(this.baseUrl + '/search', searchValues);
  }
}
