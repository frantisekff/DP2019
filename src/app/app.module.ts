import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from './shared/shared.module';
import { HeaderService } from './components/header/header.service';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { AboutComponent } from './pages/about/about.component';
import { FooterComponent } from './components/footer/footer.component';

const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  {
    path: 'caesarcipher',
    loadChildren:
      './pages/caesar-cipher-module/caesar-cipher.module#CaesarCipherModule'
  },
  {
    path: 'polyalphcipher',
    loadChildren:
      './pages/polyalphabetic-cipher-module/polyalphabetic-cipher.module#PolyalphCipherModule'
  },
  {
    path: 'monoalphcipher',
    loadChildren:
      './pages/monoalphabetic-cipher-module/monoalphabetic-cipher.module#MonoalphCipherModule'
  },
  { path: 'about', component: AboutComponent },

];

@NgModule({
  declarations: [AppComponent, HeaderComponent, Home, AboutComponent, FooterComponent],
  imports: [
    BrowserModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    HighchartsChartModule,
    SharedModule
  ],
  providers: [HeaderService],
  bootstrap: [AppComponent]
})
export class AppModule {}
