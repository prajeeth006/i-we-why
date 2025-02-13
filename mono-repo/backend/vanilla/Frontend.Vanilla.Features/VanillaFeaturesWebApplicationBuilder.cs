using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.Configuration;
using Frontend.Vanilla.Features.OpenTelemetry;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace Frontend.Vanilla.Features;

/// <summary>Adds and configures vanilla-specific <see cref="WebApplicationBuilder" /> features.</summary>
public static class VanillaFeaturesWebApplicationBuilder
{
    /// <summary>Adds and configures vanilla-specific <see cref="WebApplicationBuilder" /> features.</summary>
    /// <param name="builder">WebApplicationBuilder instance.</param>
    /// <param name="application">Application identifier/name.</param>
    /// <param name="logFolder">Defines placeholder's ${LOG_FOLDER} value.</param>
    /// <param name="customPlaceholders">Defines custom placeholders.</param>
    public static WebApplicationBuilder WithVanillaFeatures(this WebApplicationBuilder builder, string application, string logFolder, params (string, string)[] customPlaceholders)
    {
        builder.Host.UseSerilog(dispose: true);
        (string, string)[] placeholders = [("LOG_FOLDER", logFolder)];
        placeholders = placeholders.Append(customPlaceholders).ToArray();
        builder.Configuration.AddVanillaConfigurationSystem(builder.Environment, application, placeholders);
        builder.Configuration.AddEnvironmentVariables();
        builder.Services.AddOpenTelemetry().WithVanillaMetrics();
        builder.Services.AddOpenTelemetry().WithVanillaTracing(application, builder.Configuration.GetSection(OpenTelemetryBuilderExtensions.SectionName));

        return builder;
    }
}
