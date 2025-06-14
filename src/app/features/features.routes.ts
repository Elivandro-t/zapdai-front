import { Routes } from "@angular/router"
import { homeComponent } from "./pages/home/home.component"
import { dashBoard } from "./pages/dashboard/dashboard.component";
import { ClientesComponentes } from "./pages/clientes/clientes.componentes";
import { ProdutosComponentes } from "./pages/produtos/produtos.componentes";
import { DestaqueComponent } from "./pages/destaque/destaque.component";
import { pedidosComponent } from "./pages/pedidos/pedidos.component";
import { authGuardian } from "../services/auth.guard";

export const routes:Routes = [
    {
        path:"", component:homeComponent,title:"Tela admin" ,children:[
            {
               path:"",component:DestaqueComponent
            },
            {
                path:"dashboard",component:dashBoard,title:"Dashboard - Zapdai"
            },
            {
                path:"clientes",component:ClientesComponentes,title:"Clientes - Zapdai"
            },
            {
                path:"produtos",component:ProdutosComponentes,title:"Produtos - Zapdai"
            },
            {
                path:"pedidos",component:pedidosComponent,title:"Pedidos - Zapdai"
            }
        ]
        ,
        canActivate:[authGuardian]
    }
];