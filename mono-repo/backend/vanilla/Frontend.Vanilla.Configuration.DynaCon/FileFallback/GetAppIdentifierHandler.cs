using System;
using System.Diagnostics;
using Frontend.Vanilla.Core.Reflection;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

internal delegate string GetAppIdentifierHandler();

internal static class GetAppIdentifier
{
    public static readonly GetAppIdentifierHandler Handler = () =>
    {
        var processId = Process.GetCurrentProcess().Id;
        var vanillaVersion = typeof(GetAppIdentifier).Assembly.GetFullVersion();

        return $"Process {processId} Vanilla {vanillaVersion} Directory {Environment.CurrentDirectory}";
    };
}
