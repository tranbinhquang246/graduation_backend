BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CartDetail] DROP CONSTRAINT [CartDetail_productId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Evaluation] DROP CONSTRAINT [Evaluation_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [Order_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[OrderDetail] DROP CONSTRAINT [OrderDetail_productId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Evaluation] ADD CONSTRAINT [Evaluation_userId_df] DEFAULT 'anonymous' FOR [userId];

-- AlterTable
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_df] DEFAULT 'anonymous' FOR [userId];

-- AddForeignKey
ALTER TABLE [dbo].[CartDetail] ADD CONSTRAINT [CartDetail_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Evaluation] ADD CONSTRAINT [Evaluation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [OrderDetail_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
