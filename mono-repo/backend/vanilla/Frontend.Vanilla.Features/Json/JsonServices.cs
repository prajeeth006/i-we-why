using Frontend.Vanilla.Core.Json.Converters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Frontend.Vanilla.Features.Json;

internal static class JsonServices
{
    public static IServiceCollection AddJsonFeature(this IServiceCollection services)
    {
        services.AddSingleton<IJsonSerializerFactory, JsonSerializerFactory>();
        services.AddSingleton<IJsonSerializerSettingsConfigurator, VanillaJsonSerializerSettingsConfigurator>();

        services.AddSingleton<JsonConverter, ClientEvaluationResultJsonConverter>();
        services.AddSingleton<JsonConverter, NameValueCollectionJsonConverter>();
        services.AddSingleton<JsonConverter, StringEnumConverter>();

        services.AddTransient<IConfigureOptions<MvcNewtonsoftJsonOptions>, VanillaJsonOptionsSetup>();
        services.AddTransient<IConfigureOptions<MvcOptions>, VanillaMvcOptionsSetup>();

        services.AddSingleton<IJsonResponseBodyExtender, JsonResponseBodyExtender>();

        return services;
    }
}
