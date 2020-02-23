import { Component, OnInit } from '@angular/core';
import { Login }    from './login';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean; 
  login_data: any; 
  token: any;
  jwt: any;

  constructor(private router:Router,private loginservice:LoginService) {  }

  ngOnInit(): void {
  }

  login(credentials){

    this.loginservice.login(credentials)  
    .subscribe(results => {

      if (results){
        localStorage.setItem('token', results);
        this.router.navigate(['/chat']);
      }else{
        this.invalidLogin = true; 
      }  
    });
    /*let username = credentials_data.username;
    let password = credentials_data.password;

    if(username !== '' && password !== ''){
      localStorage.clear();
      localStorage.setItem("username", username);
      localStorage.setItem("role_id", '2');
      this.router.navigate(['/chat']);
    }else{
      this.invalidLogin = true; 
    }
    */
  }

}
