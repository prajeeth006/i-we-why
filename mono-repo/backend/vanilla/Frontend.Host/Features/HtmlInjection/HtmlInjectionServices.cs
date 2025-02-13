using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.HtmlInjection;

internal static class HtmlInjectionServices
{
    public static void AddHtmlInjectionFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IHtmlInjectionConfiguration, HtmlInjectionConfiguration>(HtmlInjectionConfiguration.FeatureName);
        services.AddSingleton<IHeadTagsRenderer, HeadTagsRenderer>();
        services.AddSingleton<IFooterScriptTagsRenderer, FooterScriptTagsRenderer>();
        services.AddSingleton<ISiteScriptsRenderer, SiteScriptsRenderer>();
        services.AddSingleton<ISitecoreHeadTagsRenderer, SitecoreHeadTagsRenderer>();
    }
}
