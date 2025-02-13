using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal static class UrlTransformationBuilderExtensions
    {
        public static IApplicationBuilder UseUrlTransformation(this IApplicationBuilder builder)
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            var translator = builder.ApplicationServices.GetRequiredService<IUrlTranslator>();
            var logger = builder.ApplicationServices.GetRequiredService<ILogger<UrlTransformationMiddleware>>();
            var urlConfig = builder.ApplicationServices.GetRequiredService<IUrlTransformationConfiguration>();
            builder.UseMiddleware<UrlTransformationMiddleware>(translator, logger, urlConfig);

            return builder;
        }
    }
}
