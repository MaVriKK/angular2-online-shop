import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MaterializeDirective, MaterializeModule } from "angular2-materialize";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';

import { ManageModule } from './manage/manage.module';

import { HomeComponent } from './home/home';
import { CartComponent } from './cart/cart';
import { SubscribeComponent } from './subscribe/subscribe';
import { ProductComponent } from './product/product';
import { ThankYouComponent } from './thankyou/thankyou';

@NgModule({
  imports: [ 
    BrowserModule, 
    HttpModule,
    FormsModule,
    AppRoutingModule,
    MaterializeModule,
    ManageModule
  ],
  declarations: [ 
    AppComponent,
    HomeComponent,
    CartComponent,
    SubscribeComponent,
    ProductComponent,
    ThankYouComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
