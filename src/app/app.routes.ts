import { Routes } from '@angular/router';
import { CategoriasComponent } from './features/pages/categorias/categorias.component';
import { authGuardian } from './services/auth.guard';
import { NotFoundComponent } from './features/pages/404/notFound.component';
import { LoadingComponent } from './features/pages/loading/loading.component';
import {loadingGuard } from './services/loading/loading.guard';
import { PlanosComponent } from './features/pages/planos/planos.component';
import { UnauthorizedComponent } from './features/pages/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path:"",redirectTo:"/home",pathMatch:"full",
    },
    {
        path:"admin",loadChildren:()=>import("./features/features.routes").then(rota=>rota.routes), data:{acess:["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"]}
    },
    {
       path:"auth",loadChildren:()=>import("./features/pages/auth/auth.routes").then(e=>e.routes)
    },
    {
        path:"home",component:CategoriasComponent
    },
    {
        path:"loading",component:LoadingComponent,canActivate:[loadingGuard]
    },    
    {
        path:"planos",loadChildren:()=>import("./features/pages/planos/planos.routes").then(route=>route.routes)
    },
    {
        path:"unauthorized",component:UnauthorizedComponent,canActivate:[loadingGuard]
    },
    {
        path:"**",component:NotFoundComponent, title:"404 Error"
    }
];
