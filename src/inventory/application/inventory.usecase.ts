import { inventoryRepository } from '../domain/repository/inventory.repository';

export class ProjectUseCase {
  constructor(private readonly inventoryRepository: inventoryRepository) {}
}
