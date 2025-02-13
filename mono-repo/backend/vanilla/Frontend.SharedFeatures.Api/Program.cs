using Frontend.SharedFeatures.Api;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.ApiDocs;
using Frontend.Vanilla.Features.ContentEndpoint;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Vanilla.Features.UrlTransformation;
using Frontend.Vanilla.RestMocks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args).WithVanillaFeatures(Constants.Application, "sf-api");

builder.Services.AddSharedFeaturesApiFeatures();

if (builder.Environment.EnvironmentName is "dev" or "qa")
    builder.Services.AddRestMocks();

var app = builder.Build();

await app.UseVanillaFeaturesAsync(
    configureAppBeforeRouting: appBuilder =>
    {
        if (builder.Environment.EnvironmentName is "dev" or "qa")
        {
            appBuilder.Use((context, next) =>
            {
                if (context.Request.Path.Value?.Contains("api/login") == true)
                    context.Request
                        .EnableBuffering(); // calls EnableRewind() `https://github.com/dotnet/aspnetcore/blob/4ef204e13b88c0734e0e94a1cc4c0ef05f40849e/src/Http/Http/src/Extensions/HttpRequestRewindExtensions.cs#L23`

                return next();
            });
        }
    },
    configureApp: appBuilder =>
    {
        appBuilder.UseUrlTransformation();
    });

await app.RunAsync();
