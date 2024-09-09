import prisma from '../../lib/prisma.js';
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from '../product.controller.js';


// Mock do prisma
jest.mock('../../lib/prisma.js', () => ({ 
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));


describe('Product Controller', () => { 
  
  let req, res;

  // Antes de cada teste cria um objeto req e res vazios para serem usados 
  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getProducts', () => { 
    it('deve retornar a lista de produtos com sucesso', async () => { 
      const mockProducts = [{ id: 1, name: 'Produto 1' }]; 
      prisma.product.findMany.mockResolvedValue(mockProducts); 

      await getProducts(req, res); 

      expect(prisma.product.findMany).toHaveBeenCalled(); 
      expect(res.status).toHaveBeenCalledWith(200); 
      expect(res.json).toHaveBeenCalledWith(mockProducts); 
    });

    it('deve retornar erro se falhar ao buscar os produtos', async () => { 
      prisma.product.findMany.mockRejectedValue(new Error('Erro'));

      await getProducts(req, res);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar certificados' });
    });
  });

  describe('getProduct', () => {
    it('deve retornar um produto com sucesso', async () => {
      req.params.id = '1';
      const mockProduct = { id: 1, name: 'Produto 1' };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      await getProduct(req, res);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('deve retornar erro se o produto não for encontrado', async () => {
      req.params.id = '1';
      prisma.product.findUnique.mockResolvedValue(null); // Produto não encontrado

      await getProduct(req, res);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({ // Verifica se está buscando o produto
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas!' });
    });

    it('deve retornar erro ao tentar buscar um produto', async () => {
      req.params.id = '1';
      prisma.product.findUnique.mockRejectedValue(new Error('Erro')); 

      await getProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar produto!' });
    });
  });

  describe('addProduct', () => {
    it('deve adicionar um produto com sucesso', async () => {
      req.body = { name: 'Produto 1' };
      const mockProduct = { id: 1, name: 'Produto 1' };
      prisma.product.create.mockResolvedValue(mockProduct);

      await addProduct(req, res);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: req.body,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('deve retornar erro ao falhar em adicionar o produto', async () => {
      req.body = { name: 'Produto 1' }; // Dados do produto
      prisma.product.create.mockRejectedValue(new Error('Erro'));

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao adicionar produto!' });
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto com sucesso', async () => {
      req.params.id = '1';
      req.body = { name: 'Produto Atualizado' }; // Novo nome do produto
      const mockUpdatedProduct = { id: 1, name: 'Produto Atualizado' };
      prisma.product.update.mockResolvedValue(mockUpdatedProduct);

      await updateProduct(req, res);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { productId: '1' },
        data: req.body,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    it('deve retornar erro ao tentar atualizar o produto', async () => {
      req.params.id = '1';
      req.body = { name: 'Produto Atualizado' };
      prisma.product.update.mockRejectedValue(new Error('Erro'));

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar produto!' });
    });
  });

  describe('deleteProduct', () => {
    it('deve deletar um produto com sucesso', async () => {
      req.params.id = '1';
      prisma.product.delete.mockResolvedValue({});

      await deleteProduct(req, res);

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto deletado com sucesso!' });
    });

    it('deve retornar erro ao tentar deletar um produto', async () => {
      req.params.id = '1';
      prisma.product.delete.mockRejectedValue(new Error('Erro'));

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao deletar produto!' });
    });
  });

});
