using Bwin.Sports.GraphQL.Client;
using GantryTradingConnector.Midddleware;
using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Config;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using GantryTradingConnector.Shared.Services.MarketService;
using GantryTradingConnector.Shared.Services.MarketService.GolfOutrightMarket;
using GantryTradingConnector.Shared.Wrapper;
using Microsoft.AspNetCore.Mvc;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

Log.Logger = new LoggerConfiguration().CreateLogger();

var configuration = builder.Configuration;

configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.env-{environment}.json", true, true);

builder.Host.UseSerilog((hostingContext, loggerConfiguration) =>
{
    loggerConfiguration.ReadFrom.Configuration(hostingContext.Configuration);
});


var tradingApiConfig = builder.Configuration.GetSection("TradingApi").Get<TradingApiConfiguration>();
var tcaConfig = builder.Configuration.GetSection("TradingContentApi").Get<TradingContentApiConfiguration>();
//var sportsAdminConfig = builder.Configuration.GetSection("SportsAdminApi").Get<SportsAdminApiConfiguration>();

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddTransient<ITradingHttpClient, TradingHttpClient>();

builder.Services.AddTransient<IBetContentDataService, BetContentDataService>();
builder.Services.AddTransient<IBetContentBusiness, BetContentBusiness>();
builder.Services.AddTransient<IMultiEventDataService, MultiEventDataService>();
builder.Services.AddTransient<IHealthBusiness, HealthBusiness>();
builder.Services.AddTransient<IVersionProviderBusiness, VersionProviderBusiness>();
builder.Services.AddTransient<IVersionProviderDataService, VersionProviderDataService>();
builder.Services.AddTransient<IMarketContentService, MarketContentService>();
builder.Services.AddTransient<IMarketMultiEventContentService, MarketMultiEventContentService>();
builder.Services.AddTransient<IGolfOutrightMarketService, GolfOutrightMarketService>();

builder.Services.AddOptions();
builder.Services.Configure<TradingApiConfiguration>(
    builder.Configuration.GetSection("TradingApi"));

builder.Services.Configure<BcpApiConfiguration>(
    builder.Configuration.GetSection("BcpApi"));

builder.Services.Configure<TradingContentApiConfiguration>(
    builder.Configuration.GetSection("TradingContentApi"));
builder.Services.Configure<DurationConfiguration>(
    builder.Configuration.GetSection("Duration"));

builder.Services.AddTransient(x => GraphQLHttpClient.Default());
builder.Services.AddTransient<IBetContentProvider, BetContentProvider>();


//builder.Services.AddHttpClients(tradingApiConfig, tcaConfig);

builder.Services.AddTransient<IHealthDataService, HealthDataService>();
builder.Services.AddTransient<TcaHost>();
builder.Services.AddTransient<TradingHost>();
builder.Services.AddTransient<BcpHost>();

builder.Services.AddTransient<Func<int, ITradingHost>>(serviceProvider => key =>
{
    switch (key)
    {
        case (int)ConstantHelper.TradingType.TRADING:
            return serviceProvider.GetService<TradingHost>();

        case (int)ConstantHelper.TradingType.BCP:
            return serviceProvider.GetService<BcpHost>();

        default:
            return serviceProvider.GetService<TcaHost>();
    }
});


builder.Services.AddApiVersioning(config =>
{
    // default API Version set as 1.0
    config.DefaultApiVersion = new ApiVersion(1, 0);
    // If the API version not defined in the request, default API version will be used.
    config.AssumeDefaultVersionWhenUnspecified = true;
    config.ReportApiVersions = true;
    //config.ApiVersionReader = new HeaderApiVersionReader("api-version");

});

builder.Services.AddSwaggerGen(c =>
{
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    c.IgnoreObsoleteActions();
    c.IgnoreObsoleteProperties();
    c.CustomSchemaIds(type => type.FullName);
});

builder.Services.AddCors(opt => opt.AddPolicy("CorsPolicy", c =>
{
     c.AllowAnyOrigin()
     .AllowAnyHeader()
     .AllowAnyMethod();
}));
builder.Services.AddMemoryCache();
var app = builder.Build();

app.UseSerilogRequestLogging();


// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<SiteCheckMiddleware>();

app.UseRouting();

app.UseAuthorization();

app.UseCors("CorsPolicy");

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gantry Trading Connector API V1");
    c.RoutePrefix = string.Empty;
    c.DefaultModelsExpandDepth(-1);
});

app.MapControllers();

app.Run();
