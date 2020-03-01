import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { TableComponent } from './components/table/table.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from './shared/shared.module';

const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'home/:id', component: Home },
  { path: 'caesarcipher', loadChildren: './caesar-cipher/caesar-cipher.module#CaesarCipherModule' },
  { path: 'transpositioncipher', loadChildren: './transposition-cipher/transposition-cipher.module#TranspositionCipherModule' },
  { path: 'polyalphcipher', loadChildren: './polyalphabetic-cipher/polyalphabeticCipher.module#PolyalphCipherModule' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    Home
  ],
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
export class AppModule { }
