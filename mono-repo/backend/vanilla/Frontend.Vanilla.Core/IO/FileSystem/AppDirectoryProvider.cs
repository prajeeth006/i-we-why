namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IAppDirectoryProvider
{
    RootedPath Directory { get; }
}

internal sealed class AppDirectoryProvider(string directory) : IAppDirectoryProvider
{
    public RootedPath Directory { get; } = new (directory);
}
