using System.Net.Http;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Features.UI;
using Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;
using Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration.Core;

internal static class CoreServices
{
    public static void AddCoreCoreIntegration(this IServiceCollection services)
    {
        // Core/DynaconAppBoot
        services.AddSingleton<IDynaconAppBootRestClientService, DynaconAppBootRestClientService>();
        services.AddSingleton<IBootTask, DynaconAppBootTask>();
        services.AddHostedService<DynaconAppBootRefresher>();

        // Core/ClientIP
        services.AddSingleton<IClientIPResolver>(p => p.GetRequiredService<WebClientIpResolver>());
        services.AddSingleton<IInternalRequestEvaluator>(p => p.GetRequiredService<WebClientIpResolver>());
        services.AddSingleton<IDiagnosticInfoProvider>(p => p.GetRequiredService<WebClientIpResolver>());
        services.AddSingleton<WebClientIpResolver>();
        services.AddSingleton<IClientIpResolutionAlgorithm>(p => p.Create<MockedClientIpResolutionAlgorithm>(p.Create<ClientIpResolutionAlgorithm>()));
        services.AddSingleton<IIsInternalRequestAlgorithm, IsInternalRequestAlgorithm>();

        services.AddHttpClient<ClientIpHttpClient>()
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
            { ServerCertificateCustomValidationCallback = (_, _, _, _) => true }); // TODO remove

        // Core/Labels
        services.AddSingleton<IHostPathResolver, HostPathResolver>();
        services.AddSingleton<IDefaultProductResolver, DefaultProductResolver>();
        services.AddSingleton<ISingleDomainHostPathResolver, SingleDomainHostPathResolver>();

        services.AddSingleton<ICurrentContextAccessor, WebContextAccessor>();
        services.AddSingleton<IEnvironmentProvider, WebEnvironmentProvider>();
    }
}
