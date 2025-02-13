using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.Json;

internal sealed class VanillaJsonOptionsSetup(IJsonSerializerSettingsConfigurator jsonSerializerSettingsConfigurator) : IConfigureOptions<MvcNewtonsoftJsonOptions>
{
    public void Configure(MvcNewtonsoftJsonOptions options)
    {
        jsonSerializerSettingsConfigurator.Configure(options.SerializerSettings);
    }
}
