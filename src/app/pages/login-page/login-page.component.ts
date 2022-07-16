import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (this.apiService.autologin) {
      this.router.navigate(['/']);
    }
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration * 1000,
    });
  }

  onClickSubmit(formData: any): void {
    this.apiService
      .authenticate(formData.username, formData.password)
      .subscribe(
        (response: any) => {
          this.apiService.setToken(response.token);
          this.router.navigate(['/']);
        },
        (error: any) => {
          console.error('Login failed:', error);
          this.openSnackBar('Login failed', '', 2);
        }
      );
  }
}
