USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[RemoveCacheItem]    Script Date: 06/19/2023 1:38:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RemoveCacheItem]
    @Key NVARCHAR(1024),
    @Value VARBINARY(MAX) OUT
WITH NATIVE_COMPILATION, SCHEMABINDING, EXECUTE AS OWNER
AS 
BEGIN ATOMIC WITH
(
    TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english'
)         
       
    SELECT @Value = [Value] FROM dbo.CacheItems
    WHERE [Key] = @Key;
    
    DELETE dbo.CacheItems WHERE [Key] = @Key
	DELETE dbo.CacheItems_Expiration WHERE @Key = [Key]

    --RETURN @Value;
	RETURN 0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
END

GO


