// src/app/keycloak.service.ts
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://zapdai.com/',
  realm: 'zapdaiCompany',
  clientId: 'zapdai'
});
export const initKeycloak = (): Promise<void> => {
  return keycloak
    .init({
      onLoad: 'login-required',
      flow: 'standard',
      redirectUri: window.location.origin + '/auth/signin',
      checkLoginIframe: false, // ✅ adicione isso aqui
    })
    .then(authenticated => {
      console.log('Keycloak autenticado?', authenticated);
    })
    .catch(err => {
      console.error('Erro ao iniciar o Keycloak', err);
    });
};


export default keycloak;
