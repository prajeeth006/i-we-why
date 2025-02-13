using System.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IGetPropertiesCommand
{
    FileSystemProperties? Get(RootedPath path);
}

internal sealed class GetPropertiesCommand : IGetPropertiesCommand
{
    public FileSystemProperties? Get(RootedPath path)
    {
        Guard.NotNull(path, nameof(path));

        var info = new FileInfo(path);

        // Not-found item has Attributes = -1; existing directory has Exists = false
        if (info is { Exists: false, Attributes: <= 0 })
            return null;

        var creationTime = new UtcDateTime(info.CreationTimeUtc);
        var lastWriteTime = new UtcDateTime(info.LastWriteTimeUtc);

        return info.Attributes.HasFlag(FileAttributes.Directory)
            ? new DirectoryProperties(creationTime, lastWriteTime)
            : new FileProperties(info.Length, creationTime, lastWriteTime);
    }
}
