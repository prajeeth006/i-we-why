using System;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.IO;

namespace Frontend.Vanilla.Testing;

internal static class EmbeddedResource
{
    public static byte[] FromThisAssembly(string embeddedPath)
    {
        var assembly = Assembly.GetCallingAssembly();
        var resourceName = assembly.GetName().Name + "." + embeddedPath.Replace('\\', '.').Replace('/', '.').Trim('.');

        using (var stream = assembly.GetManifestResourceStream(resourceName))
        {
            return stream?.ReadAllBytes()
                   ?? throw new Exception(
                       $"There is no embedded resource '{resourceName}' based on file '{embeddedPath}' in assembly {assembly}."
                       + $" Existing resources: {assembly.GetManifestResourceNames().Join()}");
        }
    }
}
