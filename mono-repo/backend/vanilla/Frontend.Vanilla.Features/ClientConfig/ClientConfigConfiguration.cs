using System;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.ClientConfig;

internal interface IClientConfigConfiguration
{
    TimeSpan ProviderLongExecutionWarningTime { get; }
}

internal class ClientConfigConfiguration(TimeSpan providerLongExecutionWarningTime)
    : IClientConfigConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.ClientConfig";

    [MinimumTimeSpan("00:00:00.001")]
    public TimeSpan ProviderLongExecutionWarningTime { get; set; } = providerLongExecutionWarningTime;
}
