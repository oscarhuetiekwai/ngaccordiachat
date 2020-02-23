import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any; 

  constructor(public loginservice:LoginService) { 
    
   
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelperService();
      let token_data = jwt.decodeToken(token);
      this.currentUser = token_data.username; 
    }
  }

}
