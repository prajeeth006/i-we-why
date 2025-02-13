using Microsoft.Extensions.DependencyInjection;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Host.Features.FontPreload;

internal static class FontPreloadServices
{
    public static void AddFontPreloadFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IFontPreloadConfiguration, FontPreloadConfiguration>(FontPreloadConfiguration.FeatureName);
    }
}
