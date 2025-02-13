using System;
using Microsoft.AspNetCore.Builder;

namespace Frontend.Vanilla.Features.ResponseCompression;

internal static class ResponseCompressionBuilderExtensions
{
    public static IApplicationBuilder UseVanillaResponseCompression(this IApplicationBuilder builder)
    {
        if (builder == null)
        {
            throw new ArgumentNullException(nameof(builder));
        }

        builder.UseMiddleware<CompressionLevelOptionsMiddleware>();
        builder.UseResponseCompression();

        return builder;
    }
}
