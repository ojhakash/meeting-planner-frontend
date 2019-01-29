import { Component, OnInit } from "@angular/core";
import { AppService } from "./../app.service";
import { Router } from "@angular/router";
import { log } from "util";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"]
})
export class AdminDashboardComponent implements OnInit {
  private userObjects: any[];
  private users: any[];

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.getUsers().subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.userObjects = apiResponse.data;
          this.users = apiResponse.data.map(user => user.email);
        } else {
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  public goToCalender: any = userId => {
    this.router.navigateByUrl("/admin/usercalender/" + userId);
  }; // end goToSignIn
}
