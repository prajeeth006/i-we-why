USE [VanillaCacheDB]
GO

/****** Object:  Table [dbo].[VanillaCache_DELCount]    Script Date: 06/21/2023 9:52:51 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[VanillaCache_DELCount]
(
	[fid] [bigint] IDENTITY(1,1) NOT NULL,
	[ftimestampUTC] [datetime2](7) NOT NULL,
	[fdel_cacheItems_EXP] [bigint] NOT NULL,
	[fdel_cacheItems] [bigint] NOT NULL,
	[ferror] [nvarchar](4000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,

INDEX [idx_VanillaCache_DELCount_fid] NONCLUSTERED 
(
	[fid] DESC
),
 CONSTRAINT [pk_VanillaCache_DELCount_fid]  PRIMARY KEY NONCLUSTERED HASH 
(
	[fid]
)WITH ( BUCKET_COUNT = 67108864)
)WITH ( MEMORY_OPTIMIZED = ON , DURABILITY = SCHEMA_AND_DATA )
GO

ALTER TABLE [dbo].[VanillaCache_DELCount] ADD  DEFAULT (getutcdate()) FOR [ftimestampUTC]
GO


