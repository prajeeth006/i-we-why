using Frontend.Host;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Routing;
using Frontend.TestWeb;
using Frontend.TestWeb.Host;
using Frontend.Vanilla.Features;

var builder = WebApplication.CreateBuilder(args).WithVanillaFeatures(PlaygroundPlugin.Product, "testweb");

builder.Services.AddHostServices();
builder.Services.AddTestWebServices();
builder.Services.AddSingleton<IBootstrapAssetsProvider, BootstrapAssetsProvider>();

var app = builder.Build();

await app.UseHostFeaturesAsync(
    configureAppBeforeRouting: appBuilder =>
    {
        appBuilder.Use((context, next) =>
        {
            if (context.Request.Path.Value?.Contains("api/login") == true)
                context.Request
                    .EnableBuffering(); // calls EnableRewind() `https://github.com/dotnet/aspnetcore/blob/4ef204e13b88c0734e0e94a1cc4c0ef05f40849e/src/Http/Http/src/Extensions/HttpRequestRewindExtensions.cs#L23`

            return next();
        });
    },
    configureApp: appBuilder =>
    {
        appBuilder.UseMiddleware<SampleMiddleware>(3);
        appBuilder.UseMiddleware<SampleMiddleware>(4);
    },
    configureEndpoints: endpoints =>
    {
        switch (PlaygroundPlugin.Product.Name)
        {
            case nameof(Product.ThemePark):
                endpoints.MapPublicPageRoute("public-pages", "{culture}/p/{*path}", $"{PlaygroundPlugin.ThemeParkContentRoot}/PublicPages/");
                endpoints.MapClientBootstrapRoute("themepark", "{*path}");

                break;
            case nameof(Product.TestWeb):
                endpoints.MapPublicPageRoute("public-pages", "{culture}/p/{*path}", PlaygroundPlugin.PublicPagePath);
                endpoints.MapClientBootstrapRoute("artificial-portal", "{culture}/mobileportal/{*path}");
                endpoints.MapClientBootstrapRoute("last-one", "{culture}/{*path}");

                break;
        }
    });

await app.RunAsync();
