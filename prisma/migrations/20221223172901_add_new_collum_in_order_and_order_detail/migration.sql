/*
  Warnings:

  - You are about to drop the column `priceOrder` on the `Order` table. All the data in the column will be lost.
  - Added the required column `totalOrder` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Order] DROP COLUMN [priceOrder];
ALTER TABLE [dbo].[Order] ADD [totalOrder] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[OrderDetail] ADD [price] INT NOT NULL,
[quantity] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
