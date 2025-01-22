import prismaClient from "../prisma";

interface RegistrarPedidoProps {
  clienteId?: number; // Cliente pode ser opcional
  empresaId: number;
  produtos: {
    produto_item_idProdutoItem: number;
    quantidade: number;
  }[];
  nomeCliente?: string; // Caso não esteja registrado, pode ser enviado diretamente
  pessoaRegistrouId: number;
  totalParcelas: number;
  vencimentoPrimeiraParcela?: Date;
}

export class RegistrarPedidoService {
  static execute(arg0: { clienteId: any; empresaId: any; produtos: any; nomeCliente: any; pessoaRegistrouId: any; totalParcelas: any; vencimentoPrimeiraParcela: any; }) {
    throw new Error("Method not implemented.");
  }
  async execute({
    clienteId,
    empresaId,
    produtos,
    nomeCliente,
    pessoaRegistrouId,
    totalParcelas,
    vencimentoPrimeiraParcela,
  }: RegistrarPedidoProps) {
    try {
      // Valida se todos os produtos existem no banco
      const idsProdutos = produtos.map((produto) => produto.produto_item_idProdutoItem);

      const produtosEncontrados = await prismaClient.produto_item.findMany({
        where: {
          idProdutoItem: {
            in: idsProdutos,
          },
        },
      });

      if (produtosEncontrados.length !== produtos.length) {
        throw new Error("Alguns produtos não foram encontrados.");
      }

      // Calcula o valor total do pedido
      let valorTotal = 0;
      produtos.forEach((produto) => {
        const produtoEncontrado = produtosEncontrados.find(
          (p: { idProdutoItem: number; }) => p.idProdutoItem === produto.produto_item_idProdutoItem
        );
        if (produtoEncontrado) {
          valorTotal += produtoEncontrado.valor * produto.quantidade;
        }
      });

      // Cria o pedido no banco
      const novoPedido = await prismaClient.pedido.create({
        data: {
          pessoa_idPessoa_cliente: clienteId || null,
          cliente_nome: nomeCliente || null,
          empresa_idEmpresa: empresaId,
          pessoa_idPessoa_registrou: pessoaRegistrouId,
          valorTotal,
          totalParcelas,
          vencimentoPrimeiraParcela: vencimentoPrimeiraParcela || null,
          status: "P", // Status inicial "P" (pendente, por exemplo)
          TipoTransacao_idTipoTransacao: 1, // ID padrão da transação
          item_pedido: {
            create: produtos.map((produto) => {
              const produtoEncontrado = produtosEncontrados.find(
                (p: { idProdutoItem: number; }) => p.idProdutoItem === produto.produto_item_idProdutoItem
              );
              return {
                produto_item_idProdutoItem: produto.produto_item_idProdutoItem,
                quantidade: produto.quantidade,
                valor_item: produtoEncontrado!.valor,
              };
            }),
          },
        },
        include: {
          item_pedido: true,
        },
      });

      return novoPedido;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw new Error("Erro ao criar pedido");
    }
  }
}
