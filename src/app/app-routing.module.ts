import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'home', loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioModule)
  },
  {
    path: 'other', loadChildren: () => import('./pages/other/other.module').then(m => m.OtherModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
