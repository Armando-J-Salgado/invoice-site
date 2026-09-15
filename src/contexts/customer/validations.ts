import type { CreateCustomerDto } from "./types";

export function validateCreateUserData(data: CreateCustomerDto): {success: boolean, message: string} {
  // Solo letras y espacios
  const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

  // Exactamente 4 números - 4 números
  const phoneRegex = /^\d{4}-\d{4}$/;

  // Formato: usuario@dominio.extensión
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

  if (!nameRegex.test(data.name.trim())) {
    return {success: false, message: 'El nombre asignado contiene caracteres inválidos'};
  }

  if (!phoneRegex.test(data.phoneNumber!.trim())) {
    return {success: false, message: 'El número de teléfono no sigue el formato ####-####'};
  }

  if (!emailRegex.test(data.email!.trim())) {
    return {success: false, message: 'El email no tiene un formato válido, revisa el dominio o la @'};
  }

  return {success: true, message: ''};
}

import type { UpdateCustomerDto } from "./types";

export function validateUpdateCustomerData(
  data: UpdateCustomerDto,
): {success: boolean, message: string} {
  const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
  const phoneRegex = /^\d{4}-\d{4}$/;
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

  if (data.name !== undefined && !nameRegex.test(data.name.trim())) {
    return {success: false, message: 'El nombre no es válido, contiene caracteres especiales o números'};
  }

  if (
    data.phoneNumber !== undefined &&
    !phoneRegex.test(data.phoneNumber.trim())
  ) {
    return {success: false, message: 'El número de teléfono no cumple con el formato ####-####'};
  }

  if (data.email !== undefined && !emailRegex.test(data.email.trim())) {
    return {success: false, message: 'El correo no tiene un dominio válido o la @ está mal ubicada'};
  }

  return {success: true, message: ''};
}