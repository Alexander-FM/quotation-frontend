/**
 * Parsea errores del backend con estructura GenericResponse<ErrorResponse>
 * y retorna summary y detail para mostrar en toasts/mensajes
 */
export class ErrorParser {
  /**
   * Extrae información de error desde la respuesta del backend
   * @param error Error HTTP del backend
   * @returns Objeto con summary y detail para mostrar al usuario
   */
  static parse(error: any): { summary: string; detail: string } {
    let summary = 'Error';
    let detail = 'Ocurrió un error inesperado';

    // Estructura: error.error contiene el GenericResponse del backend
    if (error?.error) {
      const backendError = error.error;

      // Summary: "Error - " + message del nivel superior
      if (backendError.message) {
        summary = `Error - ${backendError.message}`;
      }

      // Detail: mensaje del body.message (ErrorResponse)
      if (backendError.body?.message) {
        detail = backendError.body.message;
      } else if (backendError.message) {
        // Fallback: si no hay body.message, usar el message superior
        detail = backendError.message;
      }
    } else if (error?.message) {
      // Error de red u otro tipo
      summary = 'Error de conexión';
      detail = error.message;
    }

    return { summary, detail };
  }

  /**
   * Extrae solo el mensaje de detalle (para componentes que solo necesitan el detail)
   * @param error Error HTTP del backend
   * @returns Mensaje de error para mostrar
   */
  static getMessage(error: any): string {
    if (error?.error?.body?.message) {
      return error.error.body.message;
    }
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Ocurrió un error al procesar la solicitud';
  }
}
