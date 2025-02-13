using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Formatting;

namespace Frontend.Vanilla.Features.Logging;

/// <summary>
/// Creates semantic logger based on the configuration mainly from web.config.
/// </summary>
internal sealed class SemanticLoggingConfigurator(ISemanticLoggingConfiguration config, ITextFormatter formatter)
{
    public Logger BuildLog(out Action<IEnumerable<ILogEventEnricher>> injectEnrichers)
    {
        try
        {
            var loggerConfig = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.Warning()
                .MinimumLevel.Override("Frontend", LogEventLevel.Information) // add information entries originating from our namespaces
                .MinimumLevel.Override(typeof(WebTraceRecorder).ToString(), LogEventLevel.Verbose)
                .MinimumLevel.Override(ClientLogControllerMetadata.TypeName, LogEventLevel.Verbose)
                .WriteTo.Sink(new MemorySink());

            if (!OperatingSystem.IsWindows()) // TODO: remove this if later once we are not running apps in prod on windows.
            {
                loggerConfig.WriteTo.Console(formatter: SemanticLoggingJsonFormatter.Singleton);
            }

            var fileSinks = config.FileSinks.ToList();
            fileSinks.CheckNoDuplicatesBy(s => Path.GetFullPath(s.Path), StringComparer.OrdinalIgnoreCase);

            foreach (var fileSink in fileSinks.Where(o => o.Enabled))
            {
                loggerConfig.WriteTo
                    .Conditional(
                        e => (fileSink.Type == SemanticLoggingFileSinkType.App &&
                              e.MessageTemplate.Text != SemanticLoggingMessageTemplate.Health) ||
                             (fileSink.Type == SemanticLoggingFileSinkType.Health &&
                              e.MessageTemplate.Text == SemanticLoggingMessageTemplate.Health),
                        c => c.Async(a => a.File(
                                formatter,
                                fileSink.Path,
                                fileSizeLimitBytes: fileSink.FileSizeLimitBytes,
                                shared: fileSink.Shared,
                                rollOnFileSizeLimit: fileSink.RollOnFileSizeLimit,
                                retainedFileCountLimit: fileSink.RetainedFileCountLimit),
                            bufferSize: fileSink.BufferSize));
            }

            var enricher = new DependencyInjectionLogEnricher();
            injectEnrichers = enricher.InjectEnrichers;
            loggerConfig.Enrich.With(enricher);

            return loggerConfig.CreateLogger();
        }
        catch (Exception ex)
        {
            var message = "Failed to configure logging which is must-have to run the app properly."
                          + $" The configuration is based on `semanticLogging` section in apps config file: {config.SerializeToString()}";

            throw new Exception(message, ex);
        }
    }
}
