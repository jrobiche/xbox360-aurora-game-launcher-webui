import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesPageComponent } from './pages/games-page/games-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: GamesPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
