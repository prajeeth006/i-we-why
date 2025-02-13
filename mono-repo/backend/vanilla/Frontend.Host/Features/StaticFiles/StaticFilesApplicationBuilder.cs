using Frontend.Host.Features.ClientApp;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Frontend.Host.Features.StaticFiles;

internal static class StaticFilesApplicationBuilder
{
    public const string ClientDistRequestPath = $"/{StaticFilesPhysicalFileProvider.ClientDist}";

    private static bool IsClientModeEnabled(HttpContext httpContext, ClientAppMode mode)
    {
        var config = httpContext.RequestServices.GetRequiredService<IClientAppConfiguration>();
        return config.Mode == mode;
    }

    public static void UseHostStaticFiles(this IApplicationBuilder app)
    {
        var staticFilesConfiguration = app.ApplicationServices.GetRequiredService<IStaticFilesConfiguration>();

        // serves client files on /clientdist when mode is filesystem using physical file provider pointing to clientdist folder on server
        // we use default dotnet middleware and modify options to serve these files on /clientdist path and
        // we also write static files headers
        app.UseWhen(httpContext => httpContext.Request.Path.StartsWithSegments(ClientDistRequestPath) && IsClientModeEnabled(httpContext, ClientAppMode.FileSystem),
            builder =>
            {
                var clientDistFileLocationProvider = builder.ApplicationServices.GetRequiredService<IStaticFilesPhysicalFileProvider>();
                var options = builder.ApplicationServices.GetRequiredService<IOptions<StaticFileOptions>>();

                options.Value.FileProvider = clientDistFileLocationProvider.FileProvider;
                options.Value.RequestPath = ClientDistRequestPath;
                options.Value.OnPrepareResponse = context => context.Context.AddStaticFilesResponseHeaders(staticFilesConfiguration);

                builder.UseMiddleware<StaticFileMiddleware>();
            });

        // serves client files on /clientdist path in modes fileserver and devserver
        app.UseWhen(c => c.Request.Path.StartsWithSegments(ClientDistRequestPath) && !IsClientModeEnabled(c, ClientAppMode.FileSystem), b => b.UseMiddleware<ClientDistProxyMiddleware>());

        // allows serving static files from default wwwroot folder on default / path using default dotnet file provider
        // we only write static files headers
        app.UseStaticFiles(new StaticFileOptions
        {
            OnPrepareResponse = context =>
            {
                context.Context.AddStaticFilesResponseHeaders(staticFilesConfiguration);
            },
        });
    }
}
