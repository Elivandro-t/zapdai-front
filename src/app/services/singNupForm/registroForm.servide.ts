import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { cpfOuCnpjValidator, validarCep, validarEmail } from "../../../validators";

@Injectable({
    providedIn: 'root'
})

export class registroForm {
    groupform = new FormGroup({
        name: new FormControl('', Validators.required),
        telefone: new FormControl('', Validators.required),
        sexo: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email, validarEmail]),
        cpf: new FormControl('', [Validators.required, Validators.minLength(11), cpfOuCnpjValidator]),
        dataNascimento: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        repeteSenha: new FormControl('', Validators.required),


        cep: new FormControl('', [Validators.required, validarCep]),
        estado_sigla: new FormControl('', Validators.required),
        cidade: new FormControl('', Validators.required),
        bairro: new FormControl('', Validators.required),
        rua: new FormControl('', Validators.required),
        numeroEndereco: new FormControl('', Validators.required),
        complemento: new FormControl('', Validators.required),
    })




}