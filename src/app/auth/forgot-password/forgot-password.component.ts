import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { AppService } from "./../../app.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  public forgotForm: FormGroup;

  constructor(private toastr: ToastrService, private appService: AppService) {}

  ngOnInit() {
    this.forgotForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    //forgot form value initialized

    this.forgotForm.setValue({
      email: ""
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.appService.forgotPassword(this.forgotForm.value).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success(apiResponse.message);
          } else {
            this.toastr.error(apiResponse.message);
          }
        },
        err => {
          this.toastr.error("some error occured");
        }
      );
    } else {
      this.toastr.warning("please give a proper email.");
    }
  }
}
