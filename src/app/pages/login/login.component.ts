import { Component, OnInit } from '@angular/core';
import { Login }    from './login';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean; 

  constructor(private router:Router,private loginservice:LoginService) { }

  ngOnInit(): void {
  }

  login(credentials){

    this.loginservice.login(credentials)  
      .subscribe(result => { 
        if (result)
          this.router.navigate(['/']);
        else  
          this.invalidLogin = true; 
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
