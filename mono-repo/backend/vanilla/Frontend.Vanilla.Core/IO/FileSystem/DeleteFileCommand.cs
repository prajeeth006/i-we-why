using System;
using System.IO;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IDeleteFileCommand
{
    void Delete(RootedPath path);
}

internal sealed class DeleteFileCommand : IDeleteFileCommand
{
    public void Delete(RootedPath path)
    {
        try
        {
            File.Delete(path);
        }
        catch (Exception ex)
        {
            throw new IOException($"Failed deleting file '{path}'.", ex);
        }
    }
}
