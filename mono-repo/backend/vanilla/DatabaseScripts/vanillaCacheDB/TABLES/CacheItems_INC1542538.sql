USE [VanillaCacheDB]
GO

/****** Object:  Table [dbo].[CacheItems_INC1542538]    Script Date: 06/21/2023 9:52:24 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CacheItems_INC1542538](
	[Key] [nvarchar](1024) NOT NULL,
	[Value] [varbinary](max) NOT NULL,
	[IsSlidingExpiration] [bit] NOT NULL,
	[SlidingIntervalInSeconds] [int] NULL,
	[ValueDecoded] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


