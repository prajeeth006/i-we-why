using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Frontend.Vanilla.Features.OpenTelemetry;

internal static class OpenTelemetryTracerProviderBuilderExtensions
{
    public static void Build(this TracerProviderBuilder tracerProviderBuilder, string name, string grpcEndpoint, IReadOnlyList<Regex> httpClientInstrumentedPaths)
    {
        var serviceName = TracingUtils.TraceServiceName + name;
        tracerProviderBuilder
            .ConfigureResource(resource => resource.AddService(serviceName))
            .AddSource(serviceName)
            .AddAspNetCoreInstrumentation(options =>
            {
                options.EnrichWithHttpRequest = (activity, httpRequest) => activity.EnrichWithHttpRequest(httpRequest);
                options.EnrichWithHttpResponse = (activity, httpResponse) => activity.EnrichWithHttpResponse(httpResponse);
                options.Filter = context =>
                {
                    var config = context.RequestServices.GetRequiredService<IOpenTelemetryConfiguration>();
                    if (config.AllowedPathsIncoming.Count == 0)
                    {
                        return false;
                    }

                    var filter = context.RequestServices.GetRequiredService<OpenTelemetryRequestFilter>();
                    return filter.ShouldInstrument(context);
                };
            })
            .AddHttpClientInstrumentation(options =>
            {
                options.EnrichWithHttpRequestMessage = (activity, httpRequestMessage) => activity.EnrichWithHttpRequestMessage(httpRequestMessage);
                options.EnrichWithHttpResponseMessage = (activity, httpResponseMessage) => activity.EnrichAWithHttpResponseMessage(httpResponseMessage);
                options.FilterHttpRequestMessage = httpRequestMessage =>
                {
                    if (httpClientInstrumentedPaths.Count == 0 || httpRequestMessage.RequestUri is null)
                    {
                        return false;
                    }

                    var path = httpRequestMessage.RequestUri.ToString();
                    return httpClientInstrumentedPaths.Any(allowedPath => allowedPath.IsMatch(path));
                };
            })
            .AddOtlpExporter(opt =>
            {
                opt.ExportProcessorType = ExportProcessorType.Batch;
                opt.Protocol = OtlpExportProtocol.Grpc;
                opt.Endpoint = new Uri(grpcEndpoint);
            });
    }
}
