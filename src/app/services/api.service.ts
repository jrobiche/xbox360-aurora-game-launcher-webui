import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, lastValueFrom } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private token: string | null;
  private username: string | null;
  private password: string | null;

  constructor(private http: HttpClient) {
    this.token = null;
    this.username = null;
    this.password = null;
  }

  launchTitle(game: Game): any {
    return this._postTitleLaunch(
      game.directory,
      game.executable,
      `${game.type}`
    );
  }

  async login(username: string, password: string): Promise<boolean> {
    this.username = username;
    this.password = password;
    let result = false;
    try {
      let response = await lastValueFrom(this._postAuthenticate());
      this.token = response.token;
      result = true;
    } catch (e) {
      console.error('Login failed. Got the following error:', e);
      this.logout();
      result = false;
    }
    return result;
  }

  logout(): void {
    this.token = null;
    this.username = null;
    this.password = null;
  }

  getPlugin(): Observable<any> {
    return this._getPlugin();
  }

  getTitle(): Observable<any> {
    return this._getTitle();
  }

  getTitles(): Observable<any> {
    return this.http.get('/api/titles.json');
  }

  // methods interfacing directly with the aurora api
  private _postAuthenticate(): Observable<any> {
    let formData = new FormData();
    if (this.username !== null && this.password !== null) {
      formData.append('username', this.username);
      formData.append('password', this.password);
    }
    return this.http.post('/authenticate', formData);
  }

  private _getPlugin(): Observable<any> {
    let options: any = {};
    if (this.token !== null) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      options['headers'] = headers;
    }
    return this.http.get('/plugin', options);
  }

  private _getTitle(): Observable<any> {
    let options: any = {};
    if (this.token !== null) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      options['headers'] = headers;
    }
    return this.http.get('/title', options);
  }

  private _postTitleLaunch(
    path: string,
    exec: string,
    type: string
  ): Observable<any> {
    let options: any = {};
    if (this.token !== null) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      options['headers'] = headers;
    }
    let formData = new FormData();
    formData.append('path', path);
    formData.append('exec', exec);
    formData.append('type', type);
    return this.http.post('/title/launch', formData, options);
  }
}
