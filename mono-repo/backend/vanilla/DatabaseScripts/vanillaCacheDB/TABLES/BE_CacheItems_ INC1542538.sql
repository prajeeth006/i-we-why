USE [VanillaCacheDB]
GO

/****** Object:  Table [dbo].[BE_CacheItems_ INC1542538]    Script Date: 06/21/2023 9:38:32 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[BE_CacheItems_ INC1542538](
	[Key] [nvarchar](1024) NOT NULL,
	[Value] [varbinary](max) NOT NULL,
	[IsSlidingExpiration] [bit] NOT NULL,
	[SlidingIntervalInSeconds] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


