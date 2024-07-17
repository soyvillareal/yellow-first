import { authRepository } from '../repository/auth.repository';

export class AuthUseCase {
  constructor(private readonly authRepository: authRepository) {}

  async logout(req): Promise<string> {
    const authResponse: string = await new Promise((resolve, reject) => {
      this.authRepository.logout(req, (err, url) => {
        if (err) {
          // Manejar el error
          console.error(err.message);
          reject(err.message);
          return; // Asegúrate de que no se ejecuta más código después de enviar la respuesta de error
        } else {
          // Redirigir al usuario al IdP para cerrar la sesión
          resolve(url);
        }
      });
    });

    return authResponse;
  }
}
