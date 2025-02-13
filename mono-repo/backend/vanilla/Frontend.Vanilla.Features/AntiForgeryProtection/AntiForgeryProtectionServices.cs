using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.AntiForgeryProtection;

internal static class AntiForgeryProtectionServices
{
    public static IServiceCollection AddAntiForgery(this IServiceCollection services)
    {
        services.AddSingleton<IWebApiAntiForgeryFilter, WebApiAntiForgeryFilter>();

        return services;
    }
}
