using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.CanonicalLinkTag;

internal static class CanonicalLinkTagServices
{
    public static void AddCanonicalLinkTagFeature(this IServiceCollection services)
    {
        services.AddSingleton<ICanonicalLinkTagService, CanonicalLinkTagService>();
        services.AddConfiguration<ICanonicalConfiguration, CanonicalConfiguration>(CanonicalConfiguration.FeatureName);
    }
}
