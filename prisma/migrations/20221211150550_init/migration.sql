BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [user_id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [userRole] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [Users_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Products] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [descriptions] NVARCHAR(1000),
    [quantity] INT NOT NULL,
    [price] INT NOT NULL,
    [color] NVARCHAR(1000) NOT NULL,
    [material] NVARCHAR(1000) NOT NULL,
    [design] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [brand] NVARCHAR(1000) NOT NULL,
    [mainImg] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Products_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User_Infor] (
    [userId] NVARCHAR(1000) NOT NULL,
    [avatar] NVARCHAR(1000),
    [first_name] NVARCHAR(1000),
    [last_name] NVARCHAR(1000),
    CONSTRAINT [User_Infor_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Address_Delivery] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [province] NVARCHAR(1000) NOT NULL,
    [district] NVARCHAR(1000) NOT NULL,
    [commune] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Address_Delivery_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [date_order] DATETIME2 NOT NULL CONSTRAINT [Order_date_order_df] DEFAULT CURRENT_TIMESTAMP,
    [priceOrder] INT NOT NULL,
    [statusOrder] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Evaluation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [productId] INT NOT NULL,
    [rating] FLOAT(53) NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [Evaluation_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [Evaluation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Favorite] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [Favorite_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderDetail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [orderId] INT NOT NULL,
    CONSTRAINT [OrderDetail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubImage] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [link] NVARCHAR(1000) NOT NULL,
    [poisition] INT NOT NULL,
    CONSTRAINT [SubImage_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LookupType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [LookupType_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [LookupType_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LookupDesign] (
    [id] INT NOT NULL IDENTITY(1,1),
    [typeId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [LookupDesign_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [LookupDesign_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LookupBrand] (
    [id] INT NOT NULL IDENTITY(1,1),
    [designId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [LookupBrand_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [LookupBrand_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LookupMaterial] (
    [id] INT NOT NULL IDENTITY(1,1),
    [brandId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [LookupMaterial_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [LookupMaterial_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LookupColor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [materialId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [LookupColor_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [update_at] DATETIME2 NOT NULL,
    CONSTRAINT [LookupColor_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[User_Infor] ADD CONSTRAINT [User_Infor_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Address_Delivery] ADD CONSTRAINT [Address_Delivery_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Evaluation] ADD CONSTRAINT [Evaluation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Evaluation] ADD CONSTRAINT [Evaluation_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Favorite] ADD CONSTRAINT [Favorite_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Favorite] ADD CONSTRAINT [Favorite_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [OrderDetail_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderDetail] ADD CONSTRAINT [OrderDetail_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubImage] ADD CONSTRAINT [SubImage_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupDesign] ADD CONSTRAINT [LookupDesign_typeId_fkey] FOREIGN KEY ([typeId]) REFERENCES [dbo].[LookupType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupBrand] ADD CONSTRAINT [LookupBrand_designId_fkey] FOREIGN KEY ([designId]) REFERENCES [dbo].[LookupDesign]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupMaterial] ADD CONSTRAINT [LookupMaterial_brandId_fkey] FOREIGN KEY ([brandId]) REFERENCES [dbo].[LookupBrand]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LookupColor] ADD CONSTRAINT [LookupColor_materialId_fkey] FOREIGN KEY ([materialId]) REFERENCES [dbo].[LookupMaterial]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
