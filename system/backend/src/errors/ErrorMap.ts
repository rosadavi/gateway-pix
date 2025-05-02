import { AppError } from "./AppError";

const ErrorMap = {
    "not_found:item_produto": (source?: string) => new AppError("Item do produto não cadastrado", 404, source),
    "not_found:produto": (source?: string) => new AppError("Produto não cadastrado", 404, source),
    "not_found:empresa": (source?: string) => new AppError("Empresa não cadastrada", 404, source),
    "not_found:categoria": (source?: string) => new AppError("Categoria não cadastrada", 404, source),
    "duplicate:empresa": (source?: string) => new AppError("Empresa já cadastrado", 409, source),
    "duplicate:tipo_transacao": (source?: string) => new AppError("Tipo de Tipo de transação já cadastrada", 409, source),
    "duplicate:item": (source?: string) => new AppError("Item já cadastrado", 409, source),
    "duplicate:categoria": (source?: string) => new AppError("Categoria já cadastrada", 409, source),
    "duplicate:produto": (source?: string) => new AppError("Produto já cadastrada", 409, source),
    "invalid:login": (source?: string) => new AppError("Credenciais Inválidas", 401, source),
    "invalid:number": (source?: string) => new AppError("Valor de telefone inválido", 401, source),
    "invalid:id_pedido": (source?: string) => new AppError("ID do pedido inválido", 401, source),
    "internal_error:cobranca_pedido": (source?: string) => new AppError("Erro ao gerar um pedido em cobrança", 500, source)
};


export function throwError(code: keyof typeof ErrorMap, source?: string): never {
    throw ErrorMap[code](source);
}