USE [VanillaCacheDB]
GO

/****** Object:  Table [dbo].[CacheItems]    Script Date: 06/21/2023 9:39:01 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CacheItems]
(
	[Key] [nvarchar](1024) COLLATE Latin1_General_100_BIN2 NOT NULL,
	[Value] [varbinary](max) NOT NULL,
	[IsSlidingExpiration] [bit] NOT NULL,
	[SlidingIntervalInSeconds] [int] NULL,

 CONSTRAINT [pk_CacheItems]  PRIMARY KEY NONCLUSTERED HASH 
(
	[Key]
)WITH ( BUCKET_COUNT = 16777216)
)WITH ( MEMORY_OPTIMIZED = ON , DURABILITY = SCHEMA_ONLY )
GO


