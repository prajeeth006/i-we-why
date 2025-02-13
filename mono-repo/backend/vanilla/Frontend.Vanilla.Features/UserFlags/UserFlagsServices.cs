using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UserFlags;

internal static class UserFlagsServices
{
    public static void AddUserFlagsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IUserFlagsConfiguration, UserFlagsConfiguration>(UserFlagsConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, UserFlagsFeatureEnablementProvider>();
    }
}
