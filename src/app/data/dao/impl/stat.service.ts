import {Inject, Injectable, InjectionToken} from '@angular/core';
import {StatDAO} from "../interface/StatDAO";
import {Observable} from "rxjs";
import {Stat} from "../../../model/Stat";
import {HttpClient} from "@angular/common/http";

export const STAT_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class StatService implements StatDAO {

  constructor(@Inject(STAT_URL_TOKEN) private baseUrl,
              private http: HttpClient) {
  }

  getOverallStat(): Observable<Stat> {
    return this.http.get<Stat>(this.baseUrl + '/get');
  }
}
