using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.Configuration;

internal sealed class PlaceholderReplaceConfigurationSource(IConfigurationRoot baseConfiguration, params (string, string)[] placeholders) : IConfigurationSource
{
    public IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        return new PlaceholderReplaceConfigurationProvider(baseConfiguration, placeholders);
    }
}
