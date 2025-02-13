USE [VanillaContentDB]
GO

/****** Object:  Table [dbo].[tbl_Cache_Test]    Script Date: 06/21/2023 9:23:44 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_Cache_Test]
(
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Key] [nvarchar](256) COLLATE Latin1_General_100_BIN2 NULL,
	[Expiration] [datetime2](2) NOT NULL,

 CONSTRAINT [pk_tbl_Cache_Id]  PRIMARY KEY NONCLUSTERED HASH 
(
	[Id]
)WITH ( BUCKET_COUNT = 131072)
)WITH ( MEMORY_OPTIMIZED = ON , DURABILITY = SCHEMA_ONLY )
GO


