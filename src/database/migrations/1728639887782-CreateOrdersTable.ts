import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersTable1728639887782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'createdDate',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
            default: `'Pending'`,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('order', 'FK_user_order');
    await queryRunner.dropForeignKey('order', 'FK_product_order');
    await queryRunner.dropTable('order');
  }
}
