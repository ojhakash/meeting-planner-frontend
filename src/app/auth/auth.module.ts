import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "login",
        component: LoginComponent,
        pathMatch: "full"
      },
      {
        path: "signup",
        component: SignupComponent,
        pathMatch: "full"
      },
      {
        path: "forgotpassword",
        component: ForgotPasswordComponent,
        pathMatch: "full"
      },
      {
        path: "resetpassword/:token",
        component: ResetPasswordComponent,
        pathMatch: "full"
      }
    ])
  ]
})
export class AuthModule {}
