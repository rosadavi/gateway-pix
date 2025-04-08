import { AppError } from "./AppError";

const ErrorMap = {
    "not_found:item_produto": () => new AppError("Item do produto não cadastrado", 404),
    "not_found:produto": () => new AppError("Produto não cadastrado", 404),
    "not_found:empresa": () => new AppError("Empresa não cadastrada", 404),
    "duplicate:item": () => new AppError("Item já cadastrado", 409),
};

export function throwError(code: keyof typeof ErrorMap): never {
    throw ErrorMap[code]();
}