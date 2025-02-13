using System.Linq;
using Frontend.Vanilla.Features.Globalization;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Interfaces;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Writers;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Frontend.Vanilla.Features.ApiDocs;

internal sealed class CultureParameterDefaultValue : IOpenApiExtension
{
    private readonly string culture;

    public CultureParameterDefaultValue(string culture)
    {
        this.culture = culture;
    }

    public void Write(IOpenApiWriter writer, OpenApiSpecVersion specVersion)
    {
        writer.WriteValue(culture);
    }
}

internal sealed class CultureParameterOperationFilter(ILanguageService languageService) : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.Parameters == null)
        {
            return;
        }

        foreach (var parameter in operation.Parameters.Where(p => p.Name == "culture"))
        {
            parameter.Extensions.Add("default", new CultureParameterDefaultValue(languageService.Current.RouteValue));
        }
    }
}
