using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal static class UrlTransformationServices
    {
        public static void AddUrlTransformationFeature(this IServiceCollection services)
        {
            services.AddSingleton<IUrlTransformationLocalizationProvider, UrlTransformationLocalizationProvider>();
            services.AddSingleton<IUrlTransformer, UrlTransformer>();
            services.AddSingleton<IStaticUrlTransformer, StaticUrlTransformer>();
            services.AddSingleton<IUrlTranslator, UrlTranslator>();
            services.AddSingleton<IPreCachingContentProcessor, UrlTransformationContentProcessor>();
            services.AddConfiguration<IUrlTransformationConfiguration, UrlTransformationConfiguration>(UrlTransformationConfiguration.FeatureName);
        }
    }
}
