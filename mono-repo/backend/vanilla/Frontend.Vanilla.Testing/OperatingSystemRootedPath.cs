using System;
using System.IO;
using Frontend.Vanilla.Core.IO;

namespace Frontend.Vanilla.Testing;

internal static class OperatingSystemRootedPath
{
    private const string WindowsRoot = "C:/";
    private const string UnixRoot = "/";
    public static string Root => OperatingSystem.IsWindows() ? WindowsRoot : UnixRoot;
    public static RootedPath Get(string path) => new ($"{Root}{path}");

    public static RootedPath GetRandom(string extension = "")
        => new (Path.Combine($"{Root}Hidden/xxx", Path.GetRandomFileName() + extension));
}
