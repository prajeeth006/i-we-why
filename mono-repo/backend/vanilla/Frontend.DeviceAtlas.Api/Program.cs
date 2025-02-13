using Frontend.DeviceAtlas.Api;
using Frontend.DeviceAtlas.Api.Application;
using Frontend.DeviceAtlas.Api.Infrastructure;
using Serilog.Events;
using Vanilla.Extensions.Diagnostics;
using Vanilla.Extensions.Diagnostics.Health;
using Vanilla.SemanticLogging;

var semanticLoggingOptions = new SemanticLoggingOptions("deviceatlas", true, false, LogEventLevel.Warning, ("Frontend", LogEventLevel.Information));
SemanticLoggingConfigurator.Configure(semanticLoggingOptions);

try
{
    BootstrapLogger.Information("Starting the application.");
    var builder = WebApplication.CreateBuilder(args).WithDeviceAtlasFeatures();

    // app
    builder.Host.UseSemanticLogging(semanticLoggingOptions);
    builder.Services.AddHealthChecks();
    builder.Services.AddSemanticLogging();
    builder.Services.AddVanillaDiagnostics();
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure();

    var app = builder.Build();

    if (Environment.GetEnvironmentVariable("DEV_MODE") is "true")
    {
        app.UseDeveloperExceptionPage();
    }

    var deviceAtlasService = app.Services.GetRequiredService<IDeviceAtlasService>();
    await deviceAtlasService.LoadDataAsync(CancellationToken.None);

    app.UseVanillaHealthChecks();
    app.UseVanillaDiagnostics();
    app.UseWhen(ctx => ctx.Request.Path == "/", appBuilder =>
    {
        appBuilder.UseMiddleware<DeviceAtlasMiddleware>();
    });
    app.MapPrometheusScrapingEndpoint("/metrics");

    await app.RunAsync();
}
catch (Exception ex)
{
    BootstrapLogger.Fatal(ex, "Host terminated unexpectedly.");
}
finally
{
    BootstrapLogger.CloseAndFlush();
}
