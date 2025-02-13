using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.HtmlInjection;

internal static class HtmlInjectionServices
{
    public static void AddHtmlInjectionFeatureBase(this IServiceCollection services)
    {
        services.AddSingleton<IHtmlInjectionControlOverride, HtmlInjectionControlOverride>();
    }
}
