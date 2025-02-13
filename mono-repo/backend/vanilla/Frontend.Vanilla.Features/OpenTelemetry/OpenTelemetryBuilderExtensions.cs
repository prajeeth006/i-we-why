using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Caching.Hekaton;
using Frontend.Vanilla.Core.Caching;
using Microsoft.Extensions.Configuration;
using OpenTelemetry;
using OpenTelemetry.Metrics;

namespace Frontend.Vanilla.Features.OpenTelemetry;

internal static class OpenTelemetryBuilderExtensions
{
    public const string SectionName = "OpenTelemetry";
    public static IOpenTelemetryBuilder WithVanillaMetrics(this IOpenTelemetryBuilder builder)
    {
        builder.WithMetrics(meterProviderBuilder =>
        {
            meterProviderBuilder
                .AddProcessInstrumentation()
                .AddRuntimeInstrumentation()
                .AddPrometheusExporter();
            meterProviderBuilder.AddMeter(
                DistributedCacheMetricRecorder.MeterName,
                "Microsoft.AspNetCore.Hosting",
                "Microsoft.AspNetCore.Routing",
                "Microsoft.AspNetCore.Server.Kestrel",
                "Microsoft.AspNetCore.Diagnostics",
                "Microsoft.AspNetCore.HeaderParsing",
                "System.Net.Http");
            meterProviderBuilder.AddView(
                instrumentName: DistributedCacheMetricRecorder.MetricName,
                new ExplicitBucketHistogramConfiguration { Boundaries = [0.01, 0.05, 0.1, 0.25, 0.5, 1] });
        });

        return builder;
    }

    public static IOpenTelemetryBuilder WithVanillaTracing(this IOpenTelemetryBuilder builder, string product, IConfigurationSection configSection)
    {
        if (configSection is null)
        {
            throw new ApplicationException($"Configuration section with name {SectionName} is required, but not found.");
        }

        var enabled = configSection.GetValue<bool?>("Enabled", null);
        switch (enabled)
        {
            case null:
                throw new ApplicationException($"Configuration section with name {SectionName}.Enabled is required, but not found.");
            case false:
                return builder;
        }

        var grpcEndpoint = configSection.GetValue<string>("GrpcEndpoint") ?? throw new ApplicationException($"Configuration section {SectionName}.GrpcEndpoint is required, but not found.");
        var httpClientInstrumentedPathsSection = configSection.GetSection("HttpClientInstrumentedPaths") ?? throw new ApplicationException($"Configuration section {SectionName}.HttpClientInstrumentedPaths is required, but not found.");
        var httpClientInstrumentedPaths = httpClientInstrumentedPathsSection.GetChildren().Select(p => p.Value).OfType<string>().Select(path => new Regex(path, RegexOptions.IgnoreCase)).ToList();

        builder.WithTracing(tracerBuilder => tracerBuilder.Build(product, grpcEndpoint, httpClientInstrumentedPaths));

        return builder;
    }
}
