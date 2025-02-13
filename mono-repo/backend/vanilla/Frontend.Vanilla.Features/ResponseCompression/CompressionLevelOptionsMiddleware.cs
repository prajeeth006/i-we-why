using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.App;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.ResponseCompression;

internal sealed class CompressionLevelOptionsMiddleware(RequestDelegate next, IAppConfiguration appConfiguration) : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext context)
    {
        var brotliOptions = context.RequestServices.GetRequiredService<IOptions<BrotliCompressionProviderOptions>>();
        var gzipOptions = context.RequestServices.GetRequiredService<IOptions<GzipCompressionProviderOptions>>();
        // TODO: once host is extracted and no longer contains any REST api calls
        // makes sense to adjust this middleware to use some configured value
        // and then in host it can be overriden with host configured value i.e. SmallestSize
        // because it makes no sense to check for static files on API projects (i.e. sfapi)
        var compressionLevel =
            context.Request.Path.StartsWithSegments("/ClientDist", StringComparison.OrdinalIgnoreCase)
                ? appConfiguration.CompressionLevelOptions.StaticFiles ?? appConfiguration.CompressionLevelOptions.Default
                : appConfiguration.CompressionLevelOptions.Default;

        brotliOptions.Value.Level = compressionLevel;
        gzipOptions.Value.Level = compressionLevel;

        return Next(context);
    }
}
