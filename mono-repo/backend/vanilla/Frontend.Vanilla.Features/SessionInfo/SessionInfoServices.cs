using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SessionInfo;

internal static class SessionInfoServices
{
    public static void AddSessionInfoFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISessionInfoConfiguration, SessionInfoConfiguration>(SessionInfoConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, SessionInfoClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, SessionInfoFeatureEnablementProvider>();
    }
}
