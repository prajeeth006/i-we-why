using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DomainSpecificLanguage;

internal static class DslServices
{
    public static void AddDomainSpecificLanguageFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDslConfiguration, DslConfiguration>(DslConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, DomainSpecificLanguageClientConfigProvider>();
    }
}
