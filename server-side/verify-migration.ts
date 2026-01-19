import 'reflect-metadata';
import 'tsconfig-paths/register';
import { AppDataSource } from './data-source';

async function verifyMigration() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      // Check if status column exists
      const columnCheck = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'inventory' AND column_name = 'status'
        )
      `);
      
      // Check if enum type exists
      const enumCheck = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'inventory_status_enum'
        )
      `);
      
      // Get column details if it exists
      let columnDetails: any[] | null = null;
      if (columnCheck[0].exists) {
        columnDetails = await queryRunner.query(`
          SELECT column_name, data_type, udt_name, column_default
          FROM information_schema.columns 
          WHERE table_name = 'inventory' AND column_name = 'status'
        `) as any[];
      }
      
      console.log('\n=== Migration Verification ===');
      console.log('Status column exists:', columnCheck[0].exists ? '✅ YES' : '❌ NO');
      console.log('Enum type exists:', enumCheck[0].exists ? '✅ YES' : '❌ NO');
      
      if (columnDetails && columnDetails.length > 0) {
        console.log('\nColumn Details:');
        console.log(JSON.stringify(columnDetails[0], null, 2));
      }
      
      // Check if there are any inventory records
      const inventoryCount = await queryRunner.query(`
        SELECT COUNT(*) as count FROM inventory
      `);
      console.log('\nTotal inventory records:', inventoryCount[0].count);
      
      if (inventoryCount[0].count > 0) {
        const sampleRecords = await queryRunner.query(`
          SELECT id, quantity, status FROM inventory LIMIT 5
        `);
        console.log('\nSample inventory records:');
        console.log(JSON.stringify(sampleRecords, null, 2));
      }
      
      console.log('\n=== Verification Complete ===');
      
      if (columnCheck[0].exists && enumCheck[0].exists) {
        console.log('✅ Migration is properly implemented!');
        process.exit(0);
      } else {
        console.log('❌ Migration may not be fully applied');
        process.exit(1);
      }
    } finally {
      await queryRunner.release();
      await AppDataSource.destroy();
    }
  } catch (error) {
    console.error('Error verifying migration:', error);
    process.exit(1);
  }
}

verifyMigration();
