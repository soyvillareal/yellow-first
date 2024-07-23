import { v4 as uuidv4 } from 'uuid';

import { TGetProduct } from '../domain/entities/product.entity';
import { productRepository } from '../domain/repository/product.repository';
import { ProductUseCase } from './product.usecase';
import { CommonUseCase } from 'src/common/application/common.usecase';
import { EOrderType, IListAndTotal, IPageOptions } from 'src/common/domain/entities/common.entity';

describe('ProductUseCase', () => {
  const mockConfigRepository = {
    get: jest.fn((key: string) => {
      const env = { 'config.secret_key': 'test_secret_key' };
      return env[key];
    }),
  };

  const mockProductRepository: jest.Mocked<productRepository> = {
    getProductById: jest.fn(),
    getProducts: jest.fn(),
    updateStockInProduct: jest.fn(),
  };

  let productUseCase: ProductUseCase;

  beforeEach(() => {
    productUseCase = new ProductUseCase(mockProductRepository, mockConfigRepository);
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should get a list of products with pagination', async () => {
      const pageOptions: IPageOptions = {
        limit: 10,
        page: 1,
        order: EOrderType.ASC,
      };

      const resolvedGetProducts: IListAndTotal<TGetProduct[]> = {
        total: 2,
        list: [
          {
            id: uuidv4(),
            name: 'Product 1',
            description: 'Description 1',
            image: 'image1.jpg',
            price: '10000',
            stock: 10,
          },
          {
            id: uuidv4(),
            name: 'Product 2',
            description: 'Description 2',
            image: 'image2.jpg',
            price: '20000',
            stock: 20,
          },
        ],
      };

      mockProductRepository.getProducts.mockResolvedValue(resolvedGetProducts);

      const commonUseCase = new CommonUseCase(mockConfigRepository);
      const entities = commonUseCase.pageMeta(resolvedGetProducts.list, {
        itemCount: resolvedGetProducts.total,
        pageOptions: {
          limit: pageOptions.limit,
          order: pageOptions.order,
          page: pageOptions.page,
        },
      });

      const result = await productUseCase.getProducts(pageOptions);

      expect(mockProductRepository.getProducts).toHaveBeenCalledWith({
        limit: pageOptions.limit,
        order: pageOptions.order,
        page: pageOptions.page,
        skip: commonUseCase.getSkipped(pageOptions.page, pageOptions.limit),
      });
      expect(result).toEqual(entities);
    });

    it('should handle error when getting products', async () => {
      mockProductRepository.getProducts.mockRejectedValue(new Error('Failed to fetch products'));

      await expect(
        productUseCase.getProducts(
          expect.objectContaining({
            limit: expect.any(Number),
            order: expect.any(EOrderType),
            page: expect.any(Number),
          }),
        ),
      ).rejects.toThrow('Failed to fetch products');
    });
  });
});
