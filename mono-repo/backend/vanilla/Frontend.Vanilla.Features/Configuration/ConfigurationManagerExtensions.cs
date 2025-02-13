using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Frontend.Vanilla.Features.Configuration;

internal static class ConfigurationManagerExtensions
{
    public static void AddVanillaConfigurationSystem(this ConfigurationManager configuration, IHostEnvironment hostEnvironment, string application, (string, string)[] placeholders)
    {
        var environmentName = hostEnvironment.EnvironmentName.ToLower();
        var operatingSystem = OperatingSystem.IsWindows() ? "windows" :
            OperatingSystem.IsLinux() ? "linux" :
            OperatingSystem.IsMacOS() ? "macos" :
            Environment.OSVersion.Platform.ToString();

        var sharedDirectory = Path.Combine(hostEnvironment.ContentRootPath, "..", "..", "vanilla", "Shared");

        AddVanillaJsonFile(configuration, hostEnvironment, sharedDirectory, string.Empty, false);
        AddVanillaJsonFile(configuration, hostEnvironment, sharedDirectory, operatingSystem, true);

        var hierarchy = GetEnvironmentHierarchy(environmentName).ToArray();
        foreach (var environment in hierarchy)
        {
            AddVanillaJsonFile(configuration, hostEnvironment, sharedDirectory, environment, true);
        }

        configuration.AddJsonFile($"appsettings.{application}.json", optional: true, reloadOnChange: true);
        configuration.AddJsonFile($"appsettings.{application}.{operatingSystem}.json", optional: true, reloadOnChange: true);

        foreach (var environment in hierarchy)
        {
            configuration.AddJsonFile($"appsettings.{application}.{environment}.json", optional: true, reloadOnChange: true);
            configuration.AddJsonFile($"appsettings.{application}.{environment}.{operatingSystem}.json", optional: true, reloadOnChange: true);
        }
        if (VanillaEnvironment.IsDev)
        {
            AddVanillaJsonFile(configuration, hostEnvironment, sharedDirectory, "local", false);
            configuration.AddJsonFile($"appsettings.{application}.local.json", optional: true, reloadOnChange: true);
        }
        configuration.AddJsonFile("appsettings.private.json", optional: true, reloadOnChange: true);

        configuration.Sources.Add(new PlaceholderReplaceConfigurationSource(configuration, placeholders));
    }

    private static void AddVanillaJsonFile(IConfigurationBuilder configuration, IHostEnvironment hostEnvironment, string sharedDirectory, string fileInfix, bool optional)
    {
        var fileName = $"appsettings{(fileInfix.Length == 0 ? string.Empty : ".")}{fileInfix}.json";
        var fileFound = TryAddSharedFile(configuration, sharedDirectory, fileName);

        if (hostEnvironment.ContentRootFileProvider.GetFileInfo(fileName).Exists)
        {
            configuration.AddJsonFile(fileName, optional: false, reloadOnChange: true);
            return;
        }

        if (!optional && !fileFound)
        {
            throw new FileNotFoundException(
                $"Unable to locate required appsettings file: '{fileName}' in directory: '{hostEnvironment.ContentRootPath}' and (when in dev mode) in directory: '{sharedDirectory}'.");
        }
    }

    private static bool TryAddSharedFile(IConfigurationBuilder configuration, string sharedDirectory, string fileName)
    {
        if (!VanillaEnvironment.IsDev) return false;

        var sharedFilePath = Path.Combine(sharedDirectory, fileName);
        if (!File.Exists(sharedFilePath)) return false;

        configuration.AddJsonFile(sharedFilePath, optional: false, reloadOnChange: true);
        return true;
    }

    private static string[] GetEnvironmentHierarchy(string environmentName) =>
        environmentName switch
        {
            { } _ when environmentName.StartsWith("qa") || environmentName.Equals("aue") => ["test", "qa", environmentName],
            "dev" => ["test", "qa", "qa2", environmentName],
            "fvt" => ["test", environmentName],
            "beta" => ["prod", environmentName],
            { } _ when environmentName.StartsWith("beta") => ["prod", "beta", environmentName],
            _ => [environmentName]
        };
}
