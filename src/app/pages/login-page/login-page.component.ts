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
    private _apiService: ApiService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async onClickSubmit(formData: any): Promise<void> {
    let result = await this._apiService.login(
      formData.username,
      formData.password
    );
    if (result) {
      this._router.navigate(['/']);
    } else {
      this._snackBar.open('Login failed', 'CLOSE', {
        duration: 5000,
      });
    }
  }
}
