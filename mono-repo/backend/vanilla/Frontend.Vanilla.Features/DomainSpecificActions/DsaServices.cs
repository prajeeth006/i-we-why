using System;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DomainSpecificActions;

internal static class DsaServices
{
    public static void AddDomainSpecificActionsFeature(this IServiceCollection services)
    {
        services.AddConfigurationWithFactory<IDsaConfiguration, DsaConfigurationDto, DsaConfigurationFactory>(DsaConfiguration.FeatureName);
        services.AddSingleton(p => new Func<IDslCompiler>(p.GetRequiredService<IDslCompiler>));
        services.AddSingleton<IDsaPlaceholderReplacer, DsaPlaceholderReplacer>();
        services.AddSingleton<IDsaRegionSelector, DsaRegionSelector>();
    }

    public static void AddDomainSpecificActionsFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, DomainSpecificActionsClientConfigProvider>();
    }
}
