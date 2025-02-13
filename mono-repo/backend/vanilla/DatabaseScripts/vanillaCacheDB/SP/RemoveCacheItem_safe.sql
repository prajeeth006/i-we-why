USE [VanillaCacheDB]
GO

/****** Object:  StoredProcedure [dbo].[RemoveCacheItem_safe]    Script Date: 06/19/2023 1:38:38 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RemoveCacheItem_safe]
    @Key NVARCHAR(1024),
    @Value VARBINARY(MAX) OUT
WITH EXECUTE AS CALLER
AS

	declare @isdone bit
	set @isdone=0

	While (@isdone=0)
	BEGIN
	BEGIN TRY
		exec dbo.[RemoveCacheItem]  @Key, @Value OUT
		set @isdone=1
	END TRY
		 BEGIN CATCH
		 IF ERROR_NUMBER() NOT IN (41302,41305,41325,41301)
			 BEGIN
					;THROW
			 END 
		END CATCH
	END
    RETURN 0   

GO


