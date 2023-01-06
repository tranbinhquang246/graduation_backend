/*
  Warnings:

  - You are about to drop the column `designId` on the `LookupBrand` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `LookupColor` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `LookupDesign` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `LookupMaterial` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[LookupBrand] DROP CONSTRAINT [LookupBrand_designId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupColor] DROP CONSTRAINT [LookupColor_materialId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupDesign] DROP CONSTRAINT [LookupDesign_typeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LookupMaterial] DROP CONSTRAINT [LookupMaterial_brandId_fkey];

-- AlterTable
ALTER TABLE [dbo].[LookupBrand] DROP COLUMN [designId];

-- AlterTable
ALTER TABLE [dbo].[LookupColor] DROP COLUMN [materialId];

-- AlterTable
ALTER TABLE [dbo].[LookupDesign] DROP COLUMN [typeId];

-- AlterTable
ALTER TABLE [dbo].[LookupMaterial] DROP COLUMN [brandId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
