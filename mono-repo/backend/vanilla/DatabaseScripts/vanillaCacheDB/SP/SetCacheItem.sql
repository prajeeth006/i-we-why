USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[SetCacheItem]    Script Date: 06/19/2023 1:39:40 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[SetCacheItem]
    @Key NVARCHAR(1024),
    @Value VARBINARY(MAX),
    @Expiration DATETIME2(2) = NULL,
    @IsSlidingExpiration BIT,
    @SlidingIntervalInSeconds INT = NULL
WITH NATIVE_COMPILATION, SCHEMABINDING, EXECUTE AS OWNER
AS 
BEGIN ATOMIC WITH
(
    TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english'
)         

    DECLARE @NewExpiration DATETIME2(2) = @Expiration

    IF @IsSlidingExpiration = 1
	BEGIN
        SET @NewExpiration = DATEADD(SECOND, @SlidingIntervalInSeconds, GETUTCDATE())
	END

	IF (@NewExpiration='9999-12-31 23:59:59.99')
	BEGIN
		 SET @NewExpiration = DATEADD(DAY, 1, GETUTCDATE())
	END

    DELETE dbo.CacheItems WHERE @Key = [Key]
	DELETE dbo.CacheItems_Expiration WHERE @Key = [Key]

    INSERT INTO dbo.CacheItems ([Key], [Value], [IsSlidingExpiration], [SlidingIntervalInSeconds])
    VALUES (@Key, @Value, @IsSlidingExpiration, @SlidingIntervalInSeconds)

	INSERT INTO [dbo].[CacheItems_Expiration] ([Key], [Expiration])
	VALUES (@Key,@NewExpiration)

    RETURN 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
END

GO


