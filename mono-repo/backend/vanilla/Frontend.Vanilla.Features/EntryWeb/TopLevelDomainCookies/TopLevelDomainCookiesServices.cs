using System;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;

internal static class TopLevelDomainCookiesServices
{
    public static void AddEntryWebTopLevelDomainCookiesFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ITopLevelDomainCookiesConfiguration, TopLevelDomainCookiesConfiguration>(TopLevelDomainCookiesConfiguration.FeatureName);
        services.AddSingleton<Func<ITopLevelDomainCookiesConfiguration>>(c => c.GetRequiredService<ITopLevelDomainCookiesConfiguration>);
        services.AddSingleton<IClientConfigProvider, TopLevelCookiesClientConfigProvider>();
    }
}
