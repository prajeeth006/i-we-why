using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.DataSources;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration.Content;

internal static class ContentServices
{
    public static void AddContentIntegration(this IServiceCollection services)
    {
        services.AddSingleton<ISitecoreLanguageResolver, WebSitecoreLanguageResolver>();
        services.AddSingleton<IEditorOverridesResolver, WebEditorOverridesResolver>();
        services.AddSingleton<IContentRegionResolver, WebContentRegionResolver>();
        services.AddSingleton<ISmartUrlReplacementResolver, SmartUrlReplacementResolver>();
    }
}
