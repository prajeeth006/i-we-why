USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[RemoveCacheItem_v2]    Script Date: 06/19/2023 1:38:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RemoveCacheItem_v2]
    @Key NVARCHAR(1024)
WITH NATIVE_COMPILATION, SCHEMABINDING, EXECUTE AS OWNER
AS 
BEGIN ATOMIC WITH
(
    TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english'
)         
     
	declare @Value VARBINARY(MAX)

    SELECT @Value = [Value] FROM dbo.CacheItems
    WHERE [Key] = @Key;
    
    DELETE dbo.CacheItems WHERE [Key] = @Key
	DELETE dbo.CacheItems_Expiration WHERE @Key = [Key]

	select @Value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
END

GO


