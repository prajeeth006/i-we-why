using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.AssetsHandling;

/// <summary>
/// Returns contents of file embedded in the assembly based on its original relative path.
/// </summary>
internal interface IAssemblyFileProvider
{
    Stream? GetFileStream(Assembly assembly, RelativePath pathWithinAssembly);
}

internal sealed class AssemblyFileProvider : IAssemblyFileProvider
{
    public Stream? GetFileStream(Assembly assembly, RelativePath pathWithinAssembly)
    {
        var requestedResource = Clean($"{assembly.GetName().Name}.{pathWithinAssembly}");

        // Match against actual list because GetManifestResourceStream() is case-sensitive
        var matchedResources = assembly
            .GetManifestResourceNames()
            .Where(n => Clean(n) == requestedResource)
            .ToList();

        return matchedResources.Count switch
        {
            0 => null,
            1 => assembly.GetManifestResourceStream(matchedResources[0]),
            _ => throw new Exception(
                $"Requested file '{pathWithinAssembly}' withing assembly {assembly} corresponds to multiple embedded resources: {matchedResources.Dump()}."),
        };
    }

    private static string Clean(string resourceName)
        => resourceName
            .Replace('/', '.')
            .Replace('\\', '.')
            .Replace('-', '_')
            .ToLower()
            .Trim('.');
}
