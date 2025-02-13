USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[RefreshCacheItem]    Script Date: 06/19/2023 1:37:45 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RefreshCacheItem]
    @Key nvarchar(1024)
WITH NATIVE_COMPILATION, SCHEMABINDING, EXECUTE AS OWNER
AS 
BEGIN ATOMIC WITH
(
    TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english'
)         

    DECLARE @IsSlidingExpiration BIT = 0
    DECLARE @SlidingIntervalInSeconds INT = 0;
	DECLARE @Value varbinary(max)


--	DECLARE @maxdate datetime2
--	select @maxdate=max(Expiration) from dbo.CacheItems_Expiration where [Key] = @Key

-- 04-06-2018 billy changed to return only still valid values 
--if (@maxdate >= GETUTCDATE())
--begin
    SELECT 
        @Value = [Value], 
        @IsSlidingExpiration = [IsSlidingExpiration],
        @SlidingIntervalInSeconds = [SlidingIntervalInSeconds]
    FROM  
		dbo.CacheItems
    WHERE 
		[Key] = @Key;
--end
	

    -- Refresh Expiration if this item has sliding expiration set
    IF (@@ROWCOUNT > 0) AND (@IsSlidingExpiration = 1)
    BEGIN
		BEGIN TRY
			/*UPDATE dbo.CacheItems
			SET [Expiration] = DATEADD(SECOND, @SlidingIntervalInSeconds, GETUTCDATE())*/
			INSERT INTO [dbo].[CacheItems_Expiration] ([Key], [Expiration])
			VALUES (@Key, DATEADD(SECOND, @SlidingIntervalInSeconds, GETUTCDATE()))
        END TRY
		BEGIN CATCH -- do not throw an exception if it's caused by the optimistic concurrency control paradigm
            IF ERROR_NUMBER() NOT IN (41301, 41302, 41305, 41325) 
            THROW
        END CATCH

    END   

	--SELECT @Value;

    -- RETURN 0
END

GO


