/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, catchError, throwError } from "rxjs";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { SnackService } from "../services/snackBar/snack.service";

@Injectable()
export class AuthInterceptors implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router, private dialog: SnackService) { }



  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const rotasPublicas = [
      '/auth/signup',
      '/auth/signin',
      '/auth/resetPassword',
      '/planos',
      '/home',
      '/zapdai/v1/usuario/verification',
      '/zapdai/v1/usuario/code',
      '/zapdai/v1/usuario/newpasswd ',
      '/categorias/lista',
      '/zapdai/v1/empresas/lista',
      '/zapdai/v1/produtos/unit/'

    ];

    // Melhor usar URL completa e comparar com `startsWith` ou usar Regex se necessário
    const isPublicRoute = rotasPublicas.some((rota) => request.url.includes(rota));

    if (this.auth.PossuiToken() && !isPublicRoute) {
      const token = this.auth.returnToken();

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensagemErro = 'Erro inesperado. Tente novamente mais tarde.';

        // Tenta extrair mensagem personalizada
        if (error.error) {
          try {
            // Caso error.error seja um objeto
            if (typeof error.error === 'object' && error.error.erro) {
              mensagemErro = error.error.erro;
            }
            // Caso error.error seja uma string JSON
            else if (typeof error.error === 'string') {
              const erroObj = JSON.parse(error.error);
              if (erroObj.erro) {
                mensagemErro = erroObj.erro;
              } else {
                mensagemErro = error.error;
              }
            }
          } catch (_) {
            // Se o JSON estiver malformado, mostra como string pura
            mensagemErro = typeof error.error === 'string' ? error.error : mensagemErro;
          }
        }

        if ([400, 401, 403, 501, 502, 503, 504].includes(error.status)) {
          this.dialog.error(mensagemErro);
        }

        return throwError(() => new Error(error.message));
      })

    );


    // return next.handle(request).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     /*if (error.status === 500 ) {
    //       this.authApi.$refreshtoken.next(true);

    //           // this.dialog.open(ConfirmComponent);
    //     }*/
    //     if (error.status === 400) {
    //       this.dialog.openSnackBar(error?.error.erro)

    //     }
    //     if (error.status === 401) {
    //       this.dialog.openSnackBar(error?.error.erro)

    //     }
    //     if (error.status === 403) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //       this.dialog.openSnackBar('Acesso negado. Você não tem permissão para executar esta ação.');
    //     }
    //     if (error.status === 501) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     else if (error.status === 502) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     else if (error.status === 503) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     else if (error.status === 504) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     return throwError(error.message);
    //   })
    // );
  }
}