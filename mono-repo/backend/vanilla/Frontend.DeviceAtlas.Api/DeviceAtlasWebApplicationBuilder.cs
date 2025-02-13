using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Frontend.DeviceAtlas.Api;

internal static class DeviceAtlasWebApplicationBuilder
{
    private const string TraceServiceName = "mono-trace-deviceatlas";
    public static WebApplicationBuilder WithDeviceAtlasFeatures(this WebApplicationBuilder builder)
    {
        var otlpGrpcEndpoint = builder.Configuration.GetSection("OtlpGrpcEndpoint").Value ??
                        throw new ApplicationException("Configuration section OtlpGrpcEndpoint is required, but not found.");
        builder.Services.AddOpenTelemetry()
            .WithTracing(tracerBuilder =>
            {
                tracerBuilder
                    .ConfigureResource(resource => resource.AddService(TraceServiceName))
                    .AddSource(TraceServiceName)
                    .AddAspNetCoreInstrumentation(o => o.RecordException = true)
                    .AddOtlpExporter(opt =>
                    {
                        opt.ExportProcessorType = ExportProcessorType.Batch;
                        opt.Protocol = OtlpExportProtocol.Grpc;
                        opt.Endpoint = new Uri(otlpGrpcEndpoint);
                    });
            })
            .WithMetrics(meterProviderBuilder =>
            {
                meterProviderBuilder
                    .AddProcessInstrumentation()
                    .AddRuntimeInstrumentation()
                    .AddPrometheusExporter();
                meterProviderBuilder.AddMeter(
                    "Microsoft.AspNetCore.Hosting",
                    "Microsoft.AspNetCore.Routing",
                    "Microsoft.AspNetCore.Server.Kestrel",
                    "Microsoft.AspNetCore.Diagnostics",
                    "Microsoft.AspNetCore.HeaderParsing",
                    "System.Net.Http");
            });

        builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName.ToLower()}.json", optional: true, reloadOnChange: true);
        builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName.ToLower()}.{Environment.GetEnvironmentVariable("Site")}.json", optional: true, reloadOnChange: true);
        builder.Configuration.AddEnvironmentVariables();

        return builder;
    }
}
