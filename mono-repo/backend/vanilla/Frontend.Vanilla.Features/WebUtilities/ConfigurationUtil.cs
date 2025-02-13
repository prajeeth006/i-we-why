using System;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.WebUtilities;

internal static class ConfigurationUtil
{
    public static T Get<T>(IConfiguration configuration, string key)
        where T : struct
        => WrapException(key, () => configuration.GetValue<T>(key));

    public static T WrapException<T>(string sectionName, Func<T> getValue)
    {
        try
        {
            return getValue();
        }
        catch (Exception ex)
        {
            throw new AppSettingsJsonException($"Failed processing '{sectionName}' section from AppSettings.json.", ex);
        }
    }
}

internal sealed class AppSettingsJsonException(string? message, Exception? innerException) : Exception(message, innerException) { }
