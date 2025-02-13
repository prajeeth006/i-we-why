using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.IO;

/// <summary>Common properties of a file or a directory.</summary>
internal abstract class FileSystemProperties(UtcDateTime creationTime, UtcDateTime lastWriteTime)
{
    public UtcDateTime CreationTime { get; } = creationTime;
    public UtcDateTime LastWriteTime { get; } = lastWriteTime;
}

internal sealed class FileProperties(long size, UtcDateTime creationTime, UtcDateTime lastWriteTime) : FileSystemProperties(creationTime, lastWriteTime)
{
    public long Size { get; } = Guard.GreaterOrEqual(size, 0L, nameof(size));
}

internal sealed class DirectoryProperties(UtcDateTime creationTime, UtcDateTime lastWriteTime) : FileSystemProperties(creationTime, lastWriteTime) { }
