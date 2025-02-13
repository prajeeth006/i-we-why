USE [VanillaContentDB]
GO

/****** Object:  Table [dbo].[TMP_Daily_Regressed_Queries]    Script Date: 06/21/2023 9:23:58 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TMP_Daily_Regressed_Queries](
	[databasename] [varchar](100) NULL,
	[sqltext] [nvarchar](max) NULL,
	[query_id] [int] NULL,
	[query_text_id] [int] NULL,
	[runtime_stats_id_1] [int] NULL,
	[interval_1] [datetime2](7) NULL,
	[plan_1] [int] NULL,
	[avg_duration_1] [int] NULL,
	[avg_duration_2] [int] NULL,
	[plan_2] [int] NULL,
	[interval_2] [datetime2](7) NULL,
	[runtime_stats_id_2] [int] NULL,
	[CollectionTime] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[TMP_Daily_Regressed_Queries] ADD  DEFAULT (getdate()) FOR [CollectionTime]
GO


