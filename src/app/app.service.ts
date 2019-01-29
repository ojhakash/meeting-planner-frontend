import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Cookie } from "ng2-cookies/ng2-cookies";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/toPromise";
import {
  HttpErrorResponse,
  HttpClient,
  HttpParams,
  HttpHeaders
} from "@angular/common/http";
import { log } from "util";

@Injectable({
  providedIn: "root"
})
export class AppService {
  private url = "http://94.237.72.184:3000/api/v1";
  constructor(public http: HttpClient) {}

  public signupFunction(data): Observable<any> {
    console.log(data);

    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("mobileNumber", data.conutryCode + data.mobileNumber)
      .set("email", data.email)
      .set("role", data.role)
      .set("password", data.password);

    return this.http.post(`${this.url}/users/signup`, params);
  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set("email", data.email)
      .set("password", data.password);

    return this.http.post(`${this.url}/users/login`, params);
  } // end of signinFunction function.

  public getUsers(): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.get(`${this.url}/users/view/all`, { params });
  }

  public logout(): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.post(`${this.url}/users/logout`, params);
  } // end logout function

  public addMeeting(data): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("title", data.title)
      .set("description", data.description)
      .set("assignedTo", data.assignedTo)
      .set("start", data.startAt)
      .set("end", data.endAt)
      .set("primary", data.primaryColor)
      .set("secondary", data.secondaryColor);

    return this.http.post(`${this.url}/meeting/add`, params);
  } //end of addMeeting

  public getAllMeetings(data): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.get(`${this.url}/meeting/${data.userId}`, { params });
  }

  public editMeeting(data): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("title", data.title)
      .set("description", data.description)
      .set("start", data.startAt)
      .set("end", data.endAt)
      .set("primary", data.primaryColor)
      .set("secondary", data.secondaryColor);

    return this.http.put(`${this.url}/meeting/edit/${data.meetingId}`, params);
  } //end of addMeeting

  public deleteMeeting(data): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.delete(`${this.url}/meeting/delete/${data.meetingId}`, {
      params
    });
  }

  public forgotPassword(data): Observable<any> {
    const params = new HttpParams().set("email", data.email);

    return this.http.post(`${this.url}/users/forgotpassword`, params);
  }

  public resetPassword(data): Observable<any> {
    const params = new HttpParams().set("password", data.password);

    return this.http.put(
      `${this.url}/users/resetpassword/${data.token}`,
      params
    );
  }
}
