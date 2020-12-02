import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {NewSurvey} from '../models/survey-creation/new-survey';
import {environment} from '@environments/environment';
import {Observable, of} from 'rxjs';
import {Survey} from '@app/models/survey';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '@app/services/error.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private accountService: AccountService
  ) {
  }

  create(newSurvey: NewSurvey) {
    const token = this.accountService.getJwtToken();
    return this.http.post<NewSurvey>(`${environment.backendUrl}/surveys`, newSurvey, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)});
  }

  /** GET surveys from the server */
  getSurveys(): Observable<Survey[]> {
    const token = this.accountService.getJwtToken();
    // tslint:disable-next-line: max-line-length
    return this.http.get<Survey[]>(`${environment.backendUrl}/surveys`, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)})
      .pipe(catchError(this.errorService.handleError<Survey[]>('getSurveys', [])));
  }

  // /** GET survey by id. Return `undefined` when id not found */
  // getSurveyNo404<Data>(id: number): Observable<Survey> {
  //   const url = `${environment.backendUrl}/?id=${id}`;
  //   return this.http.get<Survey[]>(url)
  //     .pipe(
  //       map(surveys => survey[0]), // returns a {0|1} element array
  //       tap(h => {const outcome = h ? `fetched` : `did not find`;}),
  //       catchError(this.handleError<Survey>(`getHero id=${id}`))
  //     );
  // }

  /** GET survey by id. Will 404 if id not found */
  getSurvey(id: number): Observable<Survey> {
    const token = this.accountService.getJwtToken();
    const url = `${environment.backendUrl}/${id}`;
    return this.http.get<Survey>(url,  { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)})
    .pipe(catchError(this.errorService.handleError<Survey>(`getSurvey id=${id}`)));
  }

  /** GET surveys whose name contains search term */
  searchSurveys(term: string): Observable<Survey[]> {
    const token = this.accountService.getJwtToken();
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    // tslint:disable-next-line: max-line-length
    return this.http.get<Survey[]>(`${environment.backendUrl}/?name=${term}`, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)}).pipe(
      catchError(this.errorService.handleError<Survey[]>('searchSurveys', []))
    );
  }
}
