import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBasketTable1728730907328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'basket',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
          },
          {
            name: 'quantity',
            type: 'int',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'basket',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'basket',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('basket');
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    const productForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1,
    );
    await queryRunner.dropForeignKey('basket', userForeignKey);
    await queryRunner.dropForeignKey('basket', productForeignKey);
    await queryRunner.dropTable('basket');
  }
}
