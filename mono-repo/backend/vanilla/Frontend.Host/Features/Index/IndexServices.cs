using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.Index;

internal static class IndexServices
{
    public static void AddIndexFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IIndexHtmlConfiguration, IndexHtmlHtmlConfiguration>(IndexHtmlHtmlConfiguration.FeatureName);
        services.AddSingleton<IClientIndexHtmlProvider, ClientIndexHtmlProvider>();
        // placeholder providers
        services.AddSingleton<IIndexPlaceholderReplacementProvider, HtmlClassPlaceholderReplacementProvider>();
        services.AddSingleton<IIndexPlaceholderReplacementProvider, HtmlLangPlaceholderReplacementProvider>();
        services.AddSingleton<IIndexPlaceholderReplacementProvider, HeadPlaceholderReplacementProvider>();
        services.AddSingleton<IIndexPlaceholderReplacementProvider, BodyBeforeVnAppPlaceholderReplacementProvider>();
        services.AddSingleton<IIndexPlaceholderReplacementProvider, BodyAfterVnAppPlaceholderReplacementProvider>();
    }
}
