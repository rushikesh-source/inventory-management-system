import 'reflect-metadata';
import 'tsconfig-paths/register';
import { AppDataSource } from './data-source';
import { AddStatusToInventory1767617144371 } from './src/migrations/1767617144371-AddStatusToInventory';

async function runSingleMigration() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('Running AddStatusToInventory migration...');
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const migration = new AddStatusToInventory1767617144371();
      await migration.up(queryRunner);
      await queryRunner.commitTransaction();
      console.log('Migration completed successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error running migration:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

runSingleMigration();
