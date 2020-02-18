import { LoginComponent } from "./pages/login/login.component";
import { ChatComponent } from "./pages/chat/chat.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", component: ChatComponent },
  { path: "chat", component: ChatComponent },
  { path: "**", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
