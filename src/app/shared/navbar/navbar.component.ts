import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

import { AppService } from "./../../app.service";

import * as io from "socket.io-client";
import { log } from "util";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  public socket: any;
  public admin: Boolean = localStorage.getItem("role") === "admin";
  public role: String = localStorage.getItem("role");
  public firstName = localStorage.getItem("firstName");
  public lastName = localStorage.getItem("lastName");
  constructor(
    public appService: AppService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.socket = io("http://94.237.72.184:3000");
    this.socket.emit("set-user", { userId: localStorage.getItem("userId") });
    this.socket.on("notification", data => {
      this.toastr.info(data.notification);
    });
  }

  ngOnInit() {
    if (!localStorage.getItem("userId")) {
      this.router.navigateByUrl("/login");
    }
  }

  logout() {
    this.appService.logout().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.toastr.success("Signout successful");
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");
          localStorage.removeItem("role");

          setTimeout(() => {
            this.goToSignIn();
          }, 2000);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.error("some error occured");
      }
    );
  }
  goToSignIn: any = () => {
    this.router.navigateByUrl("/login");
  }; // end goToSignIn

  goToDashboard: any = () => {
    this.router.navigateByUrl(`/${this.role}/dashboard`);
  };
}
