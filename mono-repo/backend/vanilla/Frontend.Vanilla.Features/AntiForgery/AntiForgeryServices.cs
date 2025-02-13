using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.AntiForgery;

internal static class AntiForgeryServices
{
    public static void AddAntiForgeryFeature(this IServiceCollection services)
    {
        services.AddSingleton<IAntiForgeryToken, AntiForgeryToken>();
    }
}
