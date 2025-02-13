USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[DeleteExpiredCacheItems]    Script Date: 06/19/2023 1:33:56 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[DeleteExpiredCacheItems]
--WITH NATIVE_COMPILATION, SCHEMABINDING, EXECUTE AS OWNER
AS
BEGIN
--BEGIN ATOMIC WITH (TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english')
	
    DECLARE @CurrentTimeWithGracePeriod AS DATETIME2(2) = DATEADD(MINUTE, -1, GETUTCDATE())  -- Grace period of 1 minute included
	DECLARE @delCI_exp bigint
	DECLARE @delCI bigint
	DECLARE @rows bigint
	set @delCI_exp = 0
	set @delCI = 0
	set @rows=1

	BEGIN TRY

		DELETE top (1000000) [dbo].[CacheItems_Expiration] WHERE [Expiration] < @CurrentTimeWithGracePeriod	
		set @rows=@@ROWCOUNT
		set @delCI_exp = @delCI_exp + @rows
		while (@rows > 0)
			begin
				
				DELETE top (1000000) [dbo].[CacheItems_Expiration] WHERE [Expiration] < @CurrentTimeWithGracePeriod
				set @rows=@@ROWCOUNT
				set @delCI_exp = @delCI_exp + @rows
			end

		DELETE top (100000) [dbo].[CacheItems] where [Key] not in (select [Key] from [dbo].[CacheItems_Expiration])
		set @rows=@@ROWCOUNT
		set @delCI = @delCI + @rows
		while (@rows > 0)
			begin
				DELETE top (100000) [dbo].[CacheItems] where [Key] not in (select [Key] from [dbo].[CacheItems_Expiration])
				set @rows=@@ROWCOUNT
				set @delCI = @delCI + @rows
			end
		
		insert into admin.dbo.VanillaCache_DELCount (ftimestampUTC, fdel_cacheItems_EXP, fdel_cacheItems) 
		values (GETUTCDATE(), @delCI_exp, @delCI);
		

	END TRY

	BEGIN CATCH
	-- rewrite to write the errornumber into the table too
      IF ERROR_NUMBER() NOT IN (41302,41305,41325,41301)
		  BEGIN
			
				insert into admin.dbo.VanillaCache_DELCount (ftimestampUTC, fdel_cacheItems_EXP, fdel_cacheItems)
				values (GETUTCDATE(), @delCI_exp, @delCI);
				

				THROW;
		  END 
    END CATCH
 
	
	

END

GO


