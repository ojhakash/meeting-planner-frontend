import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

import { countryCodes } from "./../../../libs/countries.js";
import { AppService } from "./../../app.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  public firstName: any;
  public lastName: any;
  public conutryCode: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public repeatPassword: any;
  public apiKey: any;
  public countryCodes: any[] = countryCodes;
  constructor(
    public appService: AppService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      conutryCode: new FormControl(null, [Validators.required]),
      mobileNumber: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
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
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );

    this.signupForm.setValue({
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
      conutryCode: "+91",
      mobileNumber: "",
      password: "",
      repeatPassword: ""
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.appService.signupFunction(this.signupForm.value).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success("Signup successful");

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
        this.signupForm.value.password &&
        this.signupForm.value.password !== this.signupForm.value.repeatPassword
      ) {
        this.toastr.warning("password and confirm password mismatched.");
      }
      this.toastr.warning("please fill all the mandatory fields!");
    }
    // this.signupForm.reset();
  }

  checkPasswords(control: FormControl): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let pass = this.signupForm.get("password").value;
      let confirmPass = control.value;

      pass === confirmPass ? resolve(null) : reject({ notSame: true });
    });
  }

  public goToSignIn: any = () => {
    this.router.navigateByUrl("/login");
  }; // end goToSignIn
}
