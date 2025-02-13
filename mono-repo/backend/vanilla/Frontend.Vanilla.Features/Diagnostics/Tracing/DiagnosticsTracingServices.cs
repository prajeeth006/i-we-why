using System;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Core;

namespace Frontend.Vanilla.Features.Diagnostics.Tracing;

internal static class DiagnosticsTracingServices
{
    public static void AddDiagnosticsTracing(this IServiceCollection services)
    {
        services.AddSingleton<ITracingIdsProvider, TracingIdsProvider>();
        services.AddSingletonWithDecorators<ILogEventEnricher, TracingIdsLogEnricher>(b => b
            .DecorateBy<RequireConfigurationLogEnricher>());
        services.AddSingleton<WebTraceRecorder>();
        services.AddSingleton<Func<WebTraceRecorder>>(p => () => p.GetRequiredService<WebTraceRecorder>());
        services.AddSingleton<ITraceRecorder, CircularFixRecorder<WebTraceRecorder>>();
    }
}
