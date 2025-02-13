using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal interface IDeviceAtlasHeadersFilter
{
    IEnumerable<KeyValuePair<string, StringValues>> Filter(IHeaderDictionary headers);
}

internal sealed class DeviceAtlasHeadersFilter : IDeviceAtlasHeadersFilter
{
    private static readonly HashSet<string> WhitelistedHeaders = new (StringComparer.OrdinalIgnoreCase)
    {
        "save-data",
        "sec-ch-ua",
        "sec-ch-ua-mobile",
        "sec-ch-ua-platform",
        "sec-ch-ua-full-version-list",
        "sec-ch-ua-model",
        "user-agent",
        "x-device-user-agent",
        "x-operamini-phone-ua",
        "x-original-user-agent",
        "device-stock-ua",
        "x-requested-with",
    };

    public IEnumerable<KeyValuePair<string, StringValues>> Filter(IHeaderDictionary headers)
    {
        foreach (var header in headers)
        {
            if (WhitelistedHeaders.Contains(header.Key))
            {
                yield return header;
            }
        }
    }
}
