using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Theming;

internal static class ThemingServices
{
    public static void AddThemingFeature(this IServiceCollection services)
    {
        services.AddSingleton<IThemeResolver, ThemeResolver>();
    }
}
