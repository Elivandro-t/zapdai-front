import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { InputOtp } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { loadingService } from '../../../../../services/loading/loading.service';
import { SnackService } from '../../../../../services/snackBar/snack.service';
import { AuthDecodeService } from '../../../../../services/AuthUser.service';
import { apiAuthService } from '../../../../../services/apiAuth.service';
import { AuthService } from '../../../../../services/auth.service';

type verificationOPT = {
  numeroWhatsapp: number;
  code: number;
}

@Component({
  selector: 'app-form-signinCodWhatsapp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    InputOtpModule,
    FormsModule,
    InputOtp,
    PasswordModule,
    NgxMaskDirective,
  ],
  templateUrl: './form-signinCodWhatsapp.component.html',
  styleUrls: ['./form-signinCodWhatsapp.component.scss']
})
export class FormSigninCodWhatsappComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  ativo = false;
  icon: "visibility" | "visibility_off" = "visibility"
  isVisible = false;
  groupform!: FormGroup;
  usuarioId: any;

  @ViewChild('primeiroInput', { static: false }) primeiroInput!: ElementRef;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef,
    private activeRoute: loadingService,
    private router: Router,
    private snack: SnackService,
    public authDecodeUser: AuthDecodeService,
    private location: Location,
    private apiAuth: apiAuthService,
    private authService: AuthService,
  ) { }


  stepFields: Record<number, string[]> = {
    1: ['numeroWhatsapp'],
    2: ['code'],
  };

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }

  ngOnInit(): void {
    this.CarregaFormGroup({ numeroWhatsapp: 0, code: 0 }); // apenas para inicializar

    const codeControl = this.groupform.get('code');
    if (codeControl) {
      codeControl.valueChanges.subscribe(value => {
        if (value && value !== value.toUpperCase()) {
          codeControl.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
    }

    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }
  }


  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }
  }

  checkWindowSize() {
    this.isVisible = window.innerWidth <= 767;
  }

  CarregaFormGroup(verificationOPT: verificationOPT) {
    this.groupform = new FormGroup({
      numeroWhatsapp: new FormControl('', Validators.required),
      code: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  visible() {
    if (this.icon === "visibility") {
      this.icon = "visibility_off"
      this.ativo = true;
    } else {
      this.icon = "visibility"
      this.ativo = false;
    }
  }


  isRequired(nome: string): boolean {
    const control = this.groupform.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];

    return (hasRequiredError && isTouched);
  }


  markCurrentStepTouched() {
    const fields = this.stepFields[this.currentStep];
    fields.forEach(field => {
      this.groupform.controls[field].markAsTouched();
    });
  }

  isCurrentStepValid(): boolean {
    const fields = this.stepFields[this.currentStep];
    return fields.every(field => this.groupform.controls[field].valid);
  }

  next() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.cd.detectChanges();
    } else {
      this.markCurrentStepTouched();
    }
  }

  prev() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  focarProximoCampo(proximoCampo: string) {
    const proximo = document.querySelector(`[formControlName="${proximoCampo}"]`) as HTMLElement;
    if (proximo) {
      proximo.focus();
    }
  }

  enviarCodigoWhatsAppp() {
    const numeroWhatsapp = this.groupform.value.numeroWhatsapp;


    if (!numeroWhatsapp) {
      this.groupform.controls['numeroWhatsapp'].markAsTouched();
      return;
    }

    const payload = { number: numeroWhatsapp };
    console.log(payload)

    this.apiAuth.sendCodeWhatsapp(payload).subscribe((e: any) => {
      this.usuarioId = e.usuarioId
      this.currentStep = 2; // Avança para o passo de verificação
      this.snack.success(e.message)
    });

  }


  AuthUserCodeWhatsapp() {
    const code = this.groupform.value.code?.trim();;

    const payload = {
      usuario: {
        usuarioId: this.usuarioId,
      },
      code: code
    };

    this.apiAuth.signinCodeWhatsapp(payload, this.usuarioId).subscribe(item => {
      this.groupform.reset()
      if (item.authToken !== null) {
        this.authService.saveToken(item.authToken);


        // Recupera a URL salva (ou define '/' como padrão)
        const returnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl'); // limpa após usar

        // Redireciona para a página original
        setTimeout(() => {
          this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
            setTimeout(() => {
              window.location.href = returnUrl;
            }, 1000);
          });
        }, 0);
      }
    });
  }

  focarPrimeiroCampo() {
    if (this.primeiroInput && this.primeiroInput.nativeElement) {
      this.primeiroInput.nativeElement.focus();
    }
  }

  pageSignin() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/signin'])
        }, 1000);
      })

    }, 0);
  }

  pageSignup() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/signup']);
        }, 1000);
      });
    }, 0);
  }

  pageResetPassword() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/resetPassword'], { skipLocationChange: false });
        }, 1000);
      });
    }, 0);
  }

  voltarPaginaAnterior() {
    this.location.back();
  }
}
