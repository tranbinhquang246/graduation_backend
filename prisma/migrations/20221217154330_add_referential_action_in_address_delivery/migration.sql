BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Address_Delivery] DROP CONSTRAINT [Address_Delivery_userId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[Address_Delivery] ADD CONSTRAINT [Address_Delivery_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
