using Frontend.Vanilla.Core.Configuration;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Cors;

internal static class CorsServices
{
    public static IServiceCollection AddCorsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ICorsConfiguration, CorsConfiguration>(CorsConfiguration.FeatureName);
        services.AddCors();
        services.AddTransient<ICorsPolicyProvider, VanillaCorsPolicyProvider>();

        return services;
    }
}
