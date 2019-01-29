import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { FlatpickrModule } from "angularx-flatpickr";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgModule } from "@angular/core";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppService } from "./app.service";

import { AuthModule } from "./auth/auth.module";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdminUserCalenderComponent } from "./admin-user-calender/admin-user-calender.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { P404Component } from "./p404/p404.component";

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    AdminUserCalenderComponent,
    UserDashboardComponent,
    NavbarComponent,
    P404Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModalModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AuthModule,
    AppRoutingModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
