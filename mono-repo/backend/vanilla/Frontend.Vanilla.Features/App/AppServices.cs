using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.App;

internal static class AppServices
{
    public static void AddAppFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IAppConfiguration, AppConfiguration>(AppConfiguration.FeatureName);
    }
}
