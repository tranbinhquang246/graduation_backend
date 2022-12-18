BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Evaluation] DROP CONSTRAINT [Evaluation_productId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Favorite] DROP CONSTRAINT [Favorite_productId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Favorite] DROP CONSTRAINT [Favorite_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupBrand] DROP CONSTRAINT [LookupBrand_designId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupColor] DROP CONSTRAINT [LookupColor_materialId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupDesign] DROP CONSTRAINT [LookupDesign_typeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupMaterial] DROP CONSTRAINT [LookupMaterial_brandId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[OrderDetail] DROP CONSTRAINT [OrderDetail_orderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SubImage] DROP CONSTRAINT [SubImage_productId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[Evaluation] ADD CONSTRAINT [Evaluation_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Favorite] ADD CONSTRAINT [Favorite_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Favorite] ADD CONSTRAINT [Favorite_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [OrderDetail_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubImage] ADD CONSTRAINT [SubImage_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupDesign] ADD CONSTRAINT [LookupDesign_typeId_fkey] FOREIGN KEY ([typeId]) REFERENCES [dbo].[LookupType]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupBrand] ADD CONSTRAINT [LookupBrand_designId_fkey] FOREIGN KEY ([designId]) REFERENCES [dbo].[LookupDesign]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupMaterial] ADD CONSTRAINT [LookupMaterial_brandId_fkey] FOREIGN KEY ([brandId]) REFERENCES [dbo].[LookupBrand]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupColor] ADD CONSTRAINT [LookupColor_materialId_fkey] FOREIGN KEY ([materialId]) REFERENCES [dbo].[LookupMaterial]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
