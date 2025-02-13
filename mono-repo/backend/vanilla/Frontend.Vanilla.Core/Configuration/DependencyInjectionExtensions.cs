using System;
using System.Linq;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Dependency injection for adding configuration models.
/// </summary>
public static class DependencyInjectionExtensions
{
    /// <summary>
    /// Registers a configuration model.
    /// </summary>
    public static IServiceCollection AddConfiguration<TConfiguration, TDto>(this IServiceCollection services, TrimmedRequiredString featureName)
        where TConfiguration : class
        where TDto : class, TConfiguration
        => services.AddConfigurationInternal(featureName, _ => new PassThroughConfigurationFactory<TConfiguration, TDto>());

    /// <summary>Registers a configuration model with its factory which is also registered as a single instance.</summary>
    internal static IServiceCollection AddConfigurationWithFactory<TConfiguration, TDto, TFactory>(this IServiceCollection services, TrimmedRequiredString featureName)
        where TConfiguration : class
        where TDto : class
        where TFactory : class, IConfigurationFactory<TConfiguration, TDto>
        => services.AddConfigurationInternal(featureName, p => p.Create<TFactory>());

    /// <summary>Registers a configuration model with its builder.</summary>
    internal static IServiceCollection AddConfigurationWithBuilder<TConfiguration, TBuilder>(this IServiceCollection services, TrimmedRequiredString featureName)
        where TConfiguration : class
        where TBuilder : class, IConfigurationBuilder<TConfiguration>
        => services.AddConfigurationWithFactory<TConfiguration, TBuilder, ConfigurationBuilderFactory<TConfiguration, TBuilder>>(featureName);

    private static IServiceCollection AddConfigurationInternal<TConfiguration, TDto>(
        this IServiceCollection services,
        TrimmedRequiredString featureName,
        Func<IServiceProvider, IConfigurationFactory<TConfiguration, TDto>> resolveFactory)
        where TConfiguration : class
        where TDto : class
    {
        Guard.NotNull(featureName, nameof(featureName));
        Guard.Interface(typeof(TConfiguration), nameof(TConfiguration));
        Guard.FinalClass(typeof(TDto), nameof(TDto));

        return services
            .AddSingleton<IConfigurationInfo>(p =>
            {
                var factory = resolveFactory(p) ??
                              throw new Exception($"Null returned by resolution func for factory for config {typeof(TConfiguration)} of feature {featureName}.");

                return new ConfigurationInfo(featureName, typeof(TConfiguration), typeof(TDto), factory.GetType(), factoryFunc: dto =>
                {
                    var result = factory.Create((TDto)dto);

                    return result.Value.WithWarnings<object>(result.Warnings);
                });
            })
            .AddSingleton(typeof(TConfiguration), p =>
            {
                var infos = p.GetServices<IConfigurationInfo>();
                var info = infos.Single(w => w.FeatureName.Value == featureName);
                var engine = p.GetRequiredService<IConfigurationEngine>();

                return engine.CreateConfiguration(info);
            });
    }
}
