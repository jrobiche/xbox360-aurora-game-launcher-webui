import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public autologin: boolean;
  private autologinUser: string;
  private autologinPass: string;
  private token: string;

  constructor(private http: HttpClient) {
    this.token = '';
    // set following properties to enable automatic login
    this.autologin = false;
    this.autologinUser = '';
    this.autologinPass = '';
  }

  setToken(token: string): void {
    this.token = token;
  }

  isAuthenticated(): boolean {
    return this.token != '';
  }

  autoLogin(): void {
    this.authenticate(this.autologinUser, this.autologinPass).subscribe(
      (response: any) => {
        this.setToken(response.token);
      },
      (error: any) => {
        console.error('ERROR:', error);
      }
    );
  }

  authenticate(username: string, password: string): Observable<any> {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this.http.post('/authenticate', formData);
  }

  titleLaunch(game: Game): any {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    let formData = new FormData();
    formData.append('path', game.directory);
    formData.append('exec', game.executable);
    formData.append('type', `${game.type}`);
    return this.http.post('/title/launch', formData, { headers: headers });
  }

  getTitles(): Observable<any> {
    return this.http.get('/api/titles.json');
  }
}
