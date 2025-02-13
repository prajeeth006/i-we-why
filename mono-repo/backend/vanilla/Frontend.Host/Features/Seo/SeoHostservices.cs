using Frontend.Host.Features.UrlTransformation;
using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.Seo;

internal static class SeoHostservices
{
    public static void AddSeoHostFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISeoHostConfiguration, SeoHostConfiguration>(SeoHostConfiguration.FeatureName);
    }
}
