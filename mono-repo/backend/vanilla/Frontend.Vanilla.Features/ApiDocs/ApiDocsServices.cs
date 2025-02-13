using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Frontend.Vanilla.Features.ApiDocs;

internal static class ApiDocsServices
{
    public static IServiceCollection AddApiDocs(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.OperationFilter<CultureParameterOperationFilter>();
            c.CustomSchemaIds(x => x.FullName);
        });
        services.ConfigureOptions<ConfigureSwaggerGenOptions>();

        return services;
    }
}
