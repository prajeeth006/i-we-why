using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Validation;

internal static class ValidationServices
{
    public static void AddValidationFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ValidationClientConfigProvider>();
        services.AddConfiguration<IValidationConfiguration, ValidationConfiguration>(ValidationConfiguration.FeatureName);
    }
}
