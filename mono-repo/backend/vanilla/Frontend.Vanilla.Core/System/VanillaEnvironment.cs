using System;
using System.Threading;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Provides information about current environment.
/// </summary>
internal static class VanillaEnvironment
{
    public static bool IsDev => Environment.GetEnvironmentVariable("VANILLA_DEV_MODE_ENABLED") == "true";
}
