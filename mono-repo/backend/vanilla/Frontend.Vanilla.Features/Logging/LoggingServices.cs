using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Serilog.Core;

namespace Frontend.Vanilla.Features.Logging;

internal static class LoggingServices
{
    public static void AddLoggingFeature(this IServiceCollection services)
    {
        services.AddSingleton(SemanticLoggingJsonFormatter.Singleton);
        services.AddSingleton(MemorySink.Log);
        services.AddSingleton<ILogEventEnricher, ThreadLogEnricher>();
        services.AddSingleton<ILogEventEnricher, VersionsLogEnricher>();
        services.AddSingletonWithDecorators<ILogEventEnricher, HttpContextLogEnricher>(b => b.DecorateBy<RequireConfigurationLogEnricher>());

        services.AddSingleton<IConfigureOptions<LoggingOptions>, LoggingOptionsSetup>();
        services.AddSingleton<ISemanticLoggingConfiguration>(s =>
        {
            var configuration = s.GetRequiredService<IConfiguration>();
            var fileSinkSection = configuration.GetSection(nameof(SemanticLoggingFileSink));
            var healthSinkSection = configuration.GetSection(nameof(SemanticLoggingHealthFileSink));
            var fileSink = fileSinkSection.Get<SemanticLoggingFileSink>();
            var healthSink = healthSinkSection.Get<SemanticLoggingHealthFileSink>();

            if (fileSink is not null && healthSink is not null)
                return new SemanticLoggingConfiguration(fileSink, healthSink);

            return new SemanticLoggingConfiguration();
        });
    }
}
