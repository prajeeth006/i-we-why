using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UserSummary;

internal static class UserSummaryServices
{
    public static void AddUserSummaryFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IUserSummaryConfiguration, UserSummaryConfiguration>(UserSummaryConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, UserSummaryClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, UserSummaryFeatureEnablementProvider>();
    }
}
