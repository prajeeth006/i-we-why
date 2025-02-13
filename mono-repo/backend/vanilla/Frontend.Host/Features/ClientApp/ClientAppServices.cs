using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.LabelResolution;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.ClientApp;

internal static class ClientAppServices
{
    public static void AddClientAppFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IClientAppConfiguration, ClientAppConfiguration>(ClientAppConfiguration.FeatureName);
        services.AddSingleton<IClientAppService, ClientAppService>();
        services.AddHttpClient<SameSiteHttpClient>()
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { ServerCertificateCustomValidationCallback = (_, _, _, _) => true }) // TODO remove
            .ConfigureAdditionalHttpMessageHandlers((handlers, provider) =>
            {
                var config = provider.GetRequiredService<IClientAppConfiguration>();
                handlers.Add(new SameSiteUrlHandler(config));
            });
        services.AddHttpClient<ClientAppHttpClient>().AddStandardResilienceHandler();
        services.AddSingleton<IHealthCheck, ClientAppHealthCheck>();
    }
}
