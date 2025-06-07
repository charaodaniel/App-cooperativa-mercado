import { Product, Order, Market, User } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tomate Orgânico',
    category: 'Verduras',
    price: 8.50,
    unit: 'kg',
    stock: 150,
    description: 'Tomate orgânico fresco, cultivado sem agrotóxicos'
  },
  {
    id: '2',
    name: 'Alface Crespa',
    category: 'Verduras',
    price: 3.20,
    unit: 'maço',
    stock: 80,
    description: 'Alface crespa hidropônica, folhas verdes e frescas'
  },
  {
    id: '3',
    name: 'Banana Prata',
    category: 'Frutas',
    price: 4.80,
    unit: 'kg',
    stock: 200,
    description: 'Banana prata doce e madura, ideal para consumo'
  },
  {
    id: '4',
    name: 'Feijão Preto',
    category: 'Grãos',
    price: 12.90,
    unit: 'kg',
    stock: 300,
    description: 'Feijão preto premium, tipo 1, safra 2024'
  },
  {
    id: '5',
    name: 'Arroz Integral',
    category: 'Grãos',
    price: 6.50,
    unit: 'kg',
    stock: 500,
    description: 'Arroz integral longo fino, rico em fibras'
  },
  {
    id: '6',
    name: 'Leite Integral',
    category: 'Laticínios',
    price: 4.20,
    unit: 'litro',
    stock: 120,
    description: 'Leite integral pasteurizado, produto local'
  }
];

export const mockMarkets: Market[] = [
  {
    id: '1',
    name: 'Mercado São João',
    owner: 'João Silva',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-1234',
    email: 'joao@mercadosaojoao.com',
    cnpj: '12.345.678/0001-90'
  },
  {
    id: '2',
    name: 'Supermercado Família',
    owner: 'Maria Santos',
    address: 'Av. Principal, 456 - Vila Nova',
    phone: '(11) 88888-5678',
    email: 'maria@supermercadofamilia.com',
    cnpj: '98.765.432/0001-10'
  },
  {
    id: '3',
    name: 'Empório Natural',
    owner: 'Carlos Oliveira',
    address: 'Rua Verde, 789 - Jardim Alegre',
    phone: '(11) 77777-9012',
    email: 'carlos@emporionatural.com',
    cnpj: '11.222.333/0001-44'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Cooperativa',
    email: 'admin@cooperativa.com',
    role: 'cooperative'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@mercadosaojoao.com',
    role: 'market',
    marketId: '1'
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria@supermercadofamilia.com',
    role: 'market',
    marketId: '2'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    marketId: '1',
    marketName: 'Mercado São João',
    items: [
      {
        productId: '1',
        product: mockProducts[0],
        quantity: 10,
        unitPrice: 8.50,
        total: 85.00
      },
      {
        productId: '2',
        product: mockProducts[1],
        quantity: 15,
        unitPrice: 3.20,
        total: 48.00
      }
    ],
    status: 'pending',
    totalAmount: 133.00,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    notes: 'Entrega preferencial pela manhã'
  },
  {
    id: '2',
    marketId: '2',
    marketName: 'Supermercado Família',
    items: [
      {
        productId: '3',
        product: mockProducts[2],
        quantity: 25,
        unitPrice: 4.80,
        total: 120.00
      },
      {
        productId: '4',
        product: mockProducts[3],
        quantity: 5,
        unitPrice: 12.90,
        total: 64.50
      }
    ],
    status: 'confirmed',
    totalAmount: 184.50,
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-14T15:45:00')
  },
  {
    id: '3',
    marketId: '1',
    marketName: 'Mercado São João',
    items: [
      {
        productId: '5',
        product: mockProducts[4],
        quantity: 20,
        unitPrice: 6.50,
        total: 130.00
      }
    ],
    status: 'delivered',
    totalAmount: 130.00,
    createdAt: new Date('2024-01-13T09:15:00'),
    updatedAt: new Date('2024-01-13T16:30:00')
  }
];