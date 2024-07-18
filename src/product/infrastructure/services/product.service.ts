import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TGetProduct, TGetProductById } from 'src/product/domain/entities/product.entity';
import { productRepository } from 'src/product/domain/repository/product.repository';
import { IListAndTotal, IPageFilter } from 'src/common/domain/entities/common.entity';

import { ProductModel } from '../models/product.model';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class ProductService implements productRepository {
  constructor(
    @InjectRepository(ProductModel) private readonly productModel: Repository<ProductModel>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getProducts(pageOptions: IPageFilter): Promise<IListAndTotal<TGetProduct[]> | null> {
    try {
      const projects = await this.productModel.find({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
        },
        skip: pageOptions.skip,
        take: pageOptions.limit,
        order: { id: pageOptions.order },
      });

      const countProjects = await this.productModel.count();

      return {
        list: projects,
        total: countProjects,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProductById(productId: string): Promise<TGetProductById | undefined | null> {
    try {
      const project = await this.productModel.findOne({
        select: {
          price: true,
          stock: true,
        },
        where: {
          id: productId,
        },
      });

      if (project === null) {
        return undefined;
      }

      return project;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateStockInProduct(productId: string, stock: number): Promise<boolean | null> {
    try {
      const project = await this.productModel.findOneOrFail({
        where: {
          id: productId,
        },
      });

      const updatedProject = this.productModel.create({
        ...project,
        stock,
      });

      const savedProject = await this.productModel.save(updatedProject);

      return isNotEmpty(savedProject);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
