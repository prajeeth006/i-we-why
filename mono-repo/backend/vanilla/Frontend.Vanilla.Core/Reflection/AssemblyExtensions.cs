using System;
using System.Reflection;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.Reflection;

/// <summary>
/// Extension methods for the <see cref="Assembly" />.
/// </summary>
public static class AssemblyExtensions
{
    /// <summary>
    /// Gets assembly version read from AssemblyFileVersionAttribute.
    /// </summary>
    /// <param name="assembly"></param>
    /// <returns></returns>
    public static Version GetFileVersion(this Assembly assembly)
    {
        var versionStr = assembly.Get<AssemblyFileVersionAttribute>()?.Version;

        return versionStr != null ? Version.Parse(versionStr) : assembly.GetName().Version!;
    }

    /// <summary>
    /// Gets full assembly version read from AssemblyInformationalVersionAttribute.
    /// </summary>
    /// <param name="assembly"></param>
    /// <returns></returns>
    public static string GetFullVersion(this Assembly assembly)
    {
        var infoVersion = assembly.Get<AssemblyInformationalVersionAttribute>()?.InformationalVersion.WhiteSpaceToNull();

        return infoVersion ?? assembly.GetName().Version!.ToString();
    }
}
