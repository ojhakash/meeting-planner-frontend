import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdminUserCalenderComponent } from "./admin-user-calender/admin-user-calender.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { P404Component } from "./p404/p404.component";

const routes: Routes = [
  {
    path: "admin/dashboard",
    component: AdminDashboardComponent,
    data: {
      title: "Admin4"
    }
  },
  {
    path: "admin/usercalender/:userId",
    component: AdminUserCalenderComponent,
    data: {
      title: "Admin4"
    }
  },
  {
    path: "user/dashboard",
    component: UserDashboardComponent
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404"
    }
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/404", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
