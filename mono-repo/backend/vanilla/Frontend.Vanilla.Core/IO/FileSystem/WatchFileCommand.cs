using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IWatchFileCommand
{
    IChangeToken Watch(RootedPath path);
}

internal sealed class WatchFileCommand : IWatchFileCommand, IDisposable
{
    private readonly ConcurrentDictionary<string, PhysicalFileProvider> driveProviders = new ();

    public IChangeToken Watch(RootedPath path)
    {
        Guard.NotNull(path, nameof(path));

        try
        {
            var drivePath = Path.GetPathRoot(path)!;
            var driveProvider = driveProviders.GetOrAdd(drivePath, p => new PhysicalFileProvider(p));

            return driveProvider.Watch(path.Value.Substring(drivePath.Length));
        }
        catch (Exception ex)
        {
            throw new IOException($"Failed watching file '{path}'.", ex);
        }
    }

    public void Dispose()
        => driveProviders.Values.Each(p => p.Dispose());
}
