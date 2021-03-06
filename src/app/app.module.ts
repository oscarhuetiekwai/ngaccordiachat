import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './pages/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './pages/header/header.component';

@NgModule({
  declarations: [AppComponent, ChatComponent, LoginComponent, HeaderComponent],
  imports: [BrowserModule, FormsModule,AppRoutingModule, NgbModule, FontAwesomeModule,HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
