using System;
using System.Collections.Generic;
using System.Net;
using Frontend.Vanilla.Core.Collections;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Cookies;

internal interface ICookieJsonHandler
{
    string? GetValue(string name, string property);
}

internal class CookieJsonHandler(ICookieHandler cookieHandler) : ICookieJsonHandler
{
    public string? GetValue(string name, string property)
    {
        var cookieValue = cookieHandler.GetValue(name);

        if (cookieValue == null) return null;

        try
        {
            var decodedJsonValue = WebUtility.UrlDecode(cookieValue);
            var json = JsonConvert.DeserializeObject<IReadOnlyDictionary<string, object>>(decodedJsonValue);
            var propertyValue = json?.GetValue(property);

            return propertyValue?.ToString();
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Unable to parse valid value '{property}' from cookie '{name}'.", nameof(property), ex);
        }
    }
}
