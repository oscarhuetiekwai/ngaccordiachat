import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials){
    return this.http.post('/api/authenticate', JSON.stringify(credentials))
    .subscribe(response => {
      let result = response.json();
      
      if (result && result.token) {
        localStorage.setItem('token', result.token);

        let jwt = new JwtHelper();
        this.currentUser = jwt.decodeToken(localStorage.getItem('token'));

        return true; 
      }
      else return false; 
    });

    /*return (){
      localStorage.clear();
      localStorage.setItem("username", credentials.username);
      localStorage.setItem("role_id", '2');
      return true; 
    }*/
   
  }

  isLoggedIn(){
    return false;
  }
}
