import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUser: any; 
  private url = environment.apiUrl;

  constructor(private http: HttpClient,private router:Router,) {
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelperService();
      let token_data = jwt.decodeToken(token);
      this.currentUser = token_data.username; 
    }
  }

  login(credentials){
    return this.http.post(this.url+'api/auth', credentials, {responseType: 'text'});
     // let result = response.json();
      
     /* if (result && result.token) {
        localStorage.setItem('token', result.token);

        let jwt = new JwtHelper();
        this.currentUser = jwt.decodeToken(localStorage.getItem('token'));

        return true; 
      }
      else return false; */
    //});

    /*return (){
      localStorage.clear();
      localStorage.setItem("username", credentials.username);
      localStorage.setItem("role_id", '2');
      return true; 
    }*/
   
  }

  logout() { 
    localStorage.removeItem('token');
    localStorage.removeItem('currentjoinroom');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(){
    let jwt = new JwtHelperService();
    let token = localStorage.getItem('token');
    
    if(token){
      let token_username = jwt.decodeToken(token);
      return token_username;
    }else{
      return false;
    }
    
  }
}
