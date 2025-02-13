using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.MetaTags;

internal static class MetaTagsServices
{
    public static void AddMetaTagsFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, MetaTagsClientConfigProvider>();
        services.AddConfigurationWithFactory<IMetaTagsConfiguration, MetaTagsConfigurationDto, MetaTagsConfigurationFactory>("VanillaFramework.Features.Seo.MetaTags");
    }
}
