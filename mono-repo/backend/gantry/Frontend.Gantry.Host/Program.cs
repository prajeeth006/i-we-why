using Frontend.Gantry;
using Frontend.Gantry.Host;
using Frontend.Gantry.Shared.Middlewares;
using Frontend.Host;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Routing;
using Frontend.Vanilla.Features;

var builder = WebApplication.CreateBuilder(args).WithVanillaFeatures("gantry", "gantry");

builder.Services.AddHostServices();
builder.Services.AddGantryServices();
builder.Services.AddSingleton<IBootstrapAssetsProvider, BootstrapAssetsProvider>();

var app = builder.Build();

await app.UseHostFeaturesAsync(
    configureApp: appBuilder => { appBuilder.UseMiddleware<GantryApiExceptionMiddleware>(); },
    configureEndpoints: endpointRouteBuilder =>
    {
        endpointRouteBuilder.MapControllerRoute("cache/{controller}/{action}", "{culture}/cache/{controller}/{action}");

        endpointRouteBuilder.MapControllerRoute("StaticPromotion/{controller}/{action}/{id}",
            "{culture}/gantry/StaticPromotion/{controller}/{action}/{id}");

        endpointRouteBuilder.MapControllerRoute("gantry/{*path}", "{culture}/gantry/{*path}",
            new { controller = "GantryClientBootstrap", action = "GantryBootstrap" });

        endpointRouteBuilder.MapControllerRoute("gantry/{*path}", "{**path}", new { controller = "BrandImage", action = "BrandImage" });
        endpointRouteBuilder.MapClientBootstrapRoute("gantry/servererror/{*path}",
            "{culture}/gantry/servererror/{*path}");
    });

await app.RunAsync();
