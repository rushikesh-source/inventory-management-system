import 'reflect-metadata';
import 'tsconfig-paths/register';
import { AppDataSource } from './data-source';
import { AddSuperAdminRole1767621126905 } from './src/migrations/1767621126905-AddSuperAdminRole';

async function runSuperAdminMigration() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('Running AddSuperAdminRole migration...');
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const migration = new AddSuperAdminRole1767621126905();
      await migration.up(queryRunner);
      await queryRunner.commitTransaction();
      console.log('✅ Migration completed successfully!');
      console.log('SUPER_ADMIN role has been added to the database.');
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

runSuperAdminMigration();
