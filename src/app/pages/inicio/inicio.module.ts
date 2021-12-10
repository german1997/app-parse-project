import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InicioModule { }
