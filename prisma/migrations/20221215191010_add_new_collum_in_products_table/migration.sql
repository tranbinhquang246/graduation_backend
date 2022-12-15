/*
  Warnings:

  - Added the required column `update_at` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Products] ADD [create_at] DATETIME2 NOT NULL CONSTRAINT [Products_create_at_df] DEFAULT CURRENT_TIMESTAMP,
[update_at] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
