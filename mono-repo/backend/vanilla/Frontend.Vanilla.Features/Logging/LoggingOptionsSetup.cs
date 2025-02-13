using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Core;

namespace Frontend.Vanilla.Features.Logging;

internal sealed class LoggingOptions
{
    public ILogger? Logger { get; set; }
}

internal sealed class LoggingOptionsSetup(ISemanticLoggingConfiguration configuration, IEnumerable<ILogEventEnricher> enrichers)
    : IConfigureOptions<LoggingOptions>
{
    public void Configure(LoggingOptions options)
    {
        var configurator = new SemanticLoggingConfigurator(configuration, SemanticLoggingJsonFormatter.Singleton);
        Log.Logger = options.Logger = configurator.BuildLog(out var injectEnrichers);
        injectEnrichers(enrichers);
    }
}
