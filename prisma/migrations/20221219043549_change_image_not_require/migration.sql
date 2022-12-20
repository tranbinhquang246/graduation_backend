BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Products] ALTER COLUMN [mainImg] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[SubImage] ALTER COLUMN [link] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
