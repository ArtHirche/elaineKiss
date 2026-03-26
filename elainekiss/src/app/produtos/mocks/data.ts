export type Produto = {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
};

export const produtos: Produto[] = [
    { id: 1, nome: "Escova", preco: 29.9, categoria: "Escova de Cabelo" },
    { id: 2, nome: "Shampoo", preco: 39.9, categoria: "Produtos de Cabelo" },
    { id: 3, nome: "Condicionador", preco: 34.9, categoria: "Produtos de Cabelo" },
    { id: 4, nome: "Brinco", preco: 12.9, categoria: "Brincos" },
    { id: 5, nome: "Colar", preco: 19.9, categoria: "Aneis, Correntes e Pulseiras" },
    { id: 6, nome: "Pulseira", preco: 29.9, categoria: "Aneis, Correntes e Pulseiras" },
    { id: 7, nome: "Anel", preco: 39.9, categoria: "Aneis, Correntes e Pulseiras" },
    { id: 8, nome: "Estojo", preco: 25.9, categoria: "Estojo" },
    { id: 9, nome: "Tubete", preco: 29.9, categoria: "Tubetes" },
    { id: 10, nome: "Phone Scrap", preco: 39.9, categoria: "Phone Scrap" },
    { id: 11, nome: "Marca Pagina", preco: 9.9, categoria: "Marca Página" },
    { id: 12, nome: "Pin Rosa", preco: 5.9, categoria: "Button/Broches" }
];
