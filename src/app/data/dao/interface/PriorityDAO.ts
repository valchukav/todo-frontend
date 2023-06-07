import {CommonDAO} from "./CommonDAO";
import {Priority} from "../../../model/Priority";
import {PrioritySearchValues} from "../search/SearchObjects";
import {Observable} from "rxjs";

export interface PriorityDAO extends CommonDAO<Priority> {

  search(searchValues: PrioritySearchValues): Observable<any>;
}
