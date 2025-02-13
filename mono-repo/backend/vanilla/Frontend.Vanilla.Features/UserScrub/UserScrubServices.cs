using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UserScrub;

internal static class UserScrubServices
{
    public static void AddUserScrubFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IUserScrubConfiguration, UserScrubConfiguration>(UserScrubConfiguration.FeatureName);
        services.AddSingleton<IUserScrubService, UserScrubService>();
    }
}
