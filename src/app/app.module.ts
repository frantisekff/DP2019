import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { Transpositioncipher } from './transpositionCipher/transpositionCipher.component';
import { Home } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule} from '@angular/forms';
import { from } from 'rxjs';
const appRoutes: Routes = [
  { path: '', component: Home},
  { path: 'home/:id', component: Home},
  { path: 'caesarcipher', loadChildren: './caesar-cipher/caesar-cipher.module#CaesarCipherModule'},
  { path: 'transpositioncipher', component: Transpositioncipher}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    Transpositioncipher,
    Home
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
