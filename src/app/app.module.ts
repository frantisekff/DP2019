import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from './shared/shared.module';

const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'home/:id', component: Home },
  {
    path: 'caesarcipher',
    loadChildren:
      './pages/caesar-cipher-module/caesar-cipher.module#CaesarCipherModule'
  },
  {
    path: 'transpositioncipher',
    loadChildren:
      './pages/transposition-cipher-module/transposition-cipher.module#TranspositionCipherModule'
  },
  {
    path: 'polyalphcipher',
    loadChildren:
      './pages/polyalphabetic-cipher-module/polyalphabeticCipher.module#PolyalphCipherModule'
  }
];

@NgModule({
  declarations: [AppComponent, HeaderComponent, Home],
  imports: [
    BrowserModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    HighchartsChartModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
