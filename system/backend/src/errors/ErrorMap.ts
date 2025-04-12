import { AppError } from "./AppError";

const ErrorMap = {
    "not_found:item_produto": () => new AppError("Item do produto não cadastrado", 404),
    "not_found:produto": () => new AppError("Produto não cadastrado", 404),
    "not_found:empresa": () => new AppError("Empresa não cadastrada", 404),
    "not_found:categoria": () => new AppError("Categoria não cadastrada", 404),
    "duplicate:empresa": () => new AppError("Empresa já cadastrado", 409),
    "duplicate:tipo_transacao": () => new AppError("Tipo de Tipo de transação já cadastrada", 409),
    "duplicate:item": () => new AppError("Item já cadastrado", 409),
    "duplicate:categoria": () => new AppError("Categoria já cadastrada", 409),
    "duplicate:produto": () => new AppError("Produto já cadastrada", 409),
    "invalid:login": () => new AppError("Credenciais Inválidas", 401)
};

export function throwError(code: keyof typeof ErrorMap): never {
    throw ErrorMap[code]();
}