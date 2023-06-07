import {CommonDAO} from "./CommonDAO";
import {Category} from "../../../model/Category";
import {Observable} from "rxjs";
import {CategorySearchValues} from "../search/SearchObjects";

export interface CategoryDAO extends CommonDAO<Category> {

  search(searchValues: CategorySearchValues): Observable<any>;
}
