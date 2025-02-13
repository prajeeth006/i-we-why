USE [VanillaContentDB]
GO

/****** Object:  Table [dbo].[CacheItems_Expiration]    Script Date: 06/21/2023 9:23:27 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CacheItems_Expiration]
(
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Key] [nvarchar](1024) COLLATE Latin1_General_100_BIN2 NOT NULL,
	[Expiration] [datetime2](2) NOT NULL,

INDEX [idx_hash_key] NONCLUSTERED HASH 
(
	[Key]
)WITH ( BUCKET_COUNT = 16777216),
INDEX [idx_range_keyExp] NONCLUSTERED 
(
	[Key] ASC,
	[Expiration] ASC
),
 CONSTRAINT [pk_CacheItems_Expiration]  PRIMARY KEY NONCLUSTERED HASH 
(
	[Id]
)WITH ( BUCKET_COUNT = 16777216)
)WITH ( MEMORY_OPTIMIZED = ON , DURABILITY = SCHEMA_ONLY )
GO


