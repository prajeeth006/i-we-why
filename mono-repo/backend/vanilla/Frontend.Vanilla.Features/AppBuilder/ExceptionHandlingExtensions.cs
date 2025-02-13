using System;
using System.Net;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.AppBuilder;

internal static class ExceptionHandlingExtensions
{
    /// <summary>Configures customized exception handling.</summary>
    public static void UseExceptionHandling(this IApplicationBuilder app)
    {
        var webHostEnvironment = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

        if (!webHostEnvironment.IsProd())
        {
            app.UseDeveloperExceptionPage();

            return;
        }

        var logger = app.ApplicationServices.GetRequiredService<ILogger<IWebHostEnvironment>>();
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();

                if (exceptionHandlerFeature != null)
                {
                    var id = Guid.NewGuid();

                    logger.LogError(exceptionHandlerFeature.Error,
                        "Processing request with {Id} and {Endpoint} using {Path} and {RouteValues}",
                        id,
                        exceptionHandlerFeature.Endpoint?.DisplayName,
                        exceptionHandlerFeature.Path,
                        exceptionHandlerFeature.RouteValues);

                    context.Response.StatusCode = exceptionHandlerFeature.Error is AntiForgeryValidationException
                        ? (int)HttpStatusCode.Forbidden
                        : (int)HttpStatusCode.InternalServerError;

                    await context.Response.WriteAsync($"Something went wrong. Contact our support with this id {id}.", context.RequestAborted);
                }
            });
        });
    }
}
