import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

import { AppService } from "./../../app.service";
import { log } from "util";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem("userId")) {
      this.router.navigateByUrl(`/${localStorage.getItem("role")}/dashboard`);
    }
    //login form value initialized
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
    //login form value initialized

    this.loginForm.setValue({
      email: "",
      password: ""
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.appService.signinFunction(this.loginForm.value).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            localStorage.setItem("authToken", apiResponse.data.authToken);
            localStorage.setItem("userId", apiResponse.data.userDetails.userId);
            localStorage.setItem(
              "firstName",
              apiResponse.data.userDetails.firstName
            );
            localStorage.setItem(
              "lastName",
              apiResponse.data.userDetails.lastName
            );
            localStorage.setItem("role", apiResponse.data.userDetails.role);
            this.toastr.success("Signin successful");

            setTimeout(() => {
              this.goDashboard();
            }, 2000);
          } else {
            this.toastr.error(apiResponse.message);
          }
        },
        err => {
          this.toastr.error("some error occured");
        }
      );
    } else {
      this.toastr.warning("please give an email and a password.");
    }
  }

  goDashboard() {
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      this.router.navigateByUrl("/user/dashboard");
    }
    if (userRole === "admin") {
      this.router.navigateByUrl("/admin/dashboard");
    }
  }
}
