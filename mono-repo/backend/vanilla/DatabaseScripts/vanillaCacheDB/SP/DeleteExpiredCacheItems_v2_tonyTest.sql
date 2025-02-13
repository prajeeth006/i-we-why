USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[DeleteExpiredCacheItems_v2_tonyTest]    Script Date: 06/19/2023 1:36:29 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


--EXEC [dbo].[DeleteExpiredCacheItems_v2_tonyTest]

ALTER PROCEDURE [dbo].[DeleteExpiredCacheItems_v2_tonyTest]
AS
BEGIN
SET NOCOUNT ON	
    DECLARE @CurrentTimeWithGracePeriod AS DATETIME2(2) = DATEADD(SECOND, -5, GETUTCDATE())  -- Grace period of 1 minute included
	DECLARE @delCI_exp bigint
	DECLARE @delCI bigint
	DECLARE @rows bigint
	DECLARE @key VARCHAR(1024) 
	DECLARE @key_exp VARCHAR(1024) 
	DECLARE @newID bigint
	set @delCI_exp = 0
	set @delCI = 0
	set @rows=1

	BEGIN TRY

		DECLARE db_cursor2 CURSOR  FOR 
		select ID,[key] from [dbo].[CacheItems_Expiration] WHERE [Expiration] < @CurrentTimeWithGracePeriod	
		OPEN db_cursor2  
		FETCH NEXT FROM db_cursor2 INTO @newID , @key_exp
			WHILE @@FETCH_STATUS = 0  
			BEGIN  
						DELETE [dbo].[CacheItems_Expiration] where [Id]=@newID
						set @rows=@@ROWCOUNT
						set @delCI_exp = @delCI_exp + @rows
						FETCH NEXT FROM db_cursor2 INTO @newID , @key_exp		
			END 
		CLOSE db_cursor2  
		DEALLOCATE db_cursor2 

		DECLARE db_cursor CURSOR FOR 
		SELECT [Key] FROM [dbo].[CacheItems] where [Key] not in (select [Key] from [dbo].[CacheItems_Expiration])	
		OPEN db_cursor  
		FETCH NEXT FROM db_cursor INTO @key  
			WHILE @@FETCH_STATUS = 0  
			BEGIN  
						DELETE [dbo].[CacheItems] where [Key]=@key
						set @rows=@@ROWCOUNT
						set @delCI = @delCI + @rows
						FETCH NEXT FROM db_cursor INTO @key 			
			END 
		CLOSE db_cursor  
		DEALLOCATE db_cursor 

		
		insert into [dbo].[VanillaCache_DELCount] (ftimestampUTC, fdel_cacheItems_EXP, fdel_cacheItems) 
		values (GETUTCDATE(), @delCI_exp, @delCI);
		

	END TRY

	BEGIN CATCH
	-- rewrite to write the errornumber into the table too
     	print @key_exp+'as key from expired table, '+ @key +'as key from cacheditem table'
				SELECT ERROR_NUMBER(), ERROR_MESSAGE();
		insert into [dbo].[VanillaCache_DELCount] (ftimestampUTC, fdel_cacheItems_EXP, fdel_cacheItems, ferror) 
		values (GETUTCDATE(), @delCI_exp, @delCI, ERROR_MESSAGE());
				THROW;
    END CATCH
END
GO


