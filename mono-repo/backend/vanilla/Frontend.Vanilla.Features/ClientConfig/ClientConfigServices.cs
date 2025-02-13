using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ClientConfig;

internal static class ClientConfigServices
{
    public static IServiceCollection AddClientConfigFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ICachedUserValuesConfig, CachedUserValuesConfig>(CachedUserValuesConfig.FeatureName);
        services.AddConfiguration<IClientConfigConfiguration, ClientConfigConfiguration>(ClientConfigConfiguration.FeatureName);
        services.AddSingleton<IClientConfigMerger, ClientConfigMerger>();
        services.AddSingletonWithDecorators<IClientConfigMergeExecutor, ClientConfigMergeExecutor>(b => b
            .DecorateBy<FilterUnwantedForCorsClientConfigMergerExecutorDecorator>()
            .DecorateBy<RefreshClaimsClientConfigMergeExecutor>());
        services.AddSingleton<ICachedUserValuesFlag, CachedUserValuesFlag>();

        return services;
    }
}
