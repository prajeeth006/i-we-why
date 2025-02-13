using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.GlobalErrorHandling;

internal static class GlobalErrorHandlingServices
{
    public static void AddGlobalErrorHandlingFeature(this IServiceCollection services)
    {
        services.AddSingleton<IGlobalErrorHandler, GlobalErrorHandler>();
    }
}
