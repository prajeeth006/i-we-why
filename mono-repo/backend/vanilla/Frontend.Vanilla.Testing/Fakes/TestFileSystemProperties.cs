using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestFileSystemProperties
{
    public static FileProperties GetFile(long? size = null, UtcDateTime? creationTime = null, UtcDateTime? lastWriteTime = null)
    {
        return new FileProperties(
            size ?? RandomGenerator.GetInt32(),
            creationTime ?? TestTime.GetRandomUtc(),
            lastWriteTime ?? TestTime.GetRandomUtc());
    }

    public static DirectoryProperties GetDirectory(UtcDateTime? creationTime = null, UtcDateTime? lastWriteTime = null)
    {
        return new DirectoryProperties(
            creationTime ?? TestTime.GetRandomUtc(),
            lastWriteTime ?? TestTime.GetRandomUtc());
    }
}
