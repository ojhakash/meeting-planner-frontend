import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppService } from "./../../app.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  private token: String;
  constructor(
    public appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get("token");
    });
    this.resetForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      repeatPassword: new FormControl(
        null,
        [Validators.required],
        this.checkPasswords.bind(this)
      )
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.appService
        .resetPassword({ ...this.resetForm.value, token: this.token })
        .subscribe(
          apiResponse => {
            if (apiResponse.status === 200) {
              this.toastr.success(apiResponse.message);
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
    } else {
      if (
        this.resetForm.value.password &&
        this.resetForm.value.password !== this.resetForm.value.repeatPassword
      ) {
        this.toastr.warning("password and confirm password mismatched.");
      }
      this.toastr.warning("please fill all fields!");
    }
  }

  checkPasswords(control: FormControl): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let pass = this.resetForm.get("password").value;
      let confirmPass = control.value;

      pass === confirmPass ? resolve(null) : reject({ notSame: true });
    });
  }

  public goToSignIn: any = () => {
    this.router.navigateByUrl("/login");
  }; // end goToSignIn
}
