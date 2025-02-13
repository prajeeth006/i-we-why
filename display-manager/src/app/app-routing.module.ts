import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HostConnectionComponent } from './host-connection/host-connection.component'; 
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'; 
import { AuthGuard } from './common/auth-guard/auth.guard';

const routes: Routes = [
  { path: 'health', component: HostConnectionComponent, canActivate: [AuthGuard] },  
  { path: '', loadChildren: () => import('./display-manager/display-manager.module').then(m => m.DisplayManagerModule), canActivate: [AuthGuard] },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}