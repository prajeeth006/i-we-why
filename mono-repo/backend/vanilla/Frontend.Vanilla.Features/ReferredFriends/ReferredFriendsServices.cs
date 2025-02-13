using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ReferredFriends;

internal static class ReferredFriendsServices
{
    public static void AddReferredFriendsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IReferredFriendsConfiguration, ReferredFriendsConfiguration>(ReferredFriendsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, ReferredFriendsClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, ReferredFriendsFeatureEnablementProvider>();
    }
}
