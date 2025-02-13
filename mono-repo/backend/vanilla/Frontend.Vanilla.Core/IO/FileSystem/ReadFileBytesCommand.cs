using System;
using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IReadFileBytesCommand
{
    Task<byte[]> ReadAsync(ExecutionMode mode, RootedPath path);
}

internal sealed class ReadFileBytesCommand : IReadFileBytesCommand
{
    public async Task<byte[]> ReadAsync(ExecutionMode mode, RootedPath path)
    {
        try
        {
            using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read)) // Just read, others can too
                return await stream.ReadAllBytesAsync(mode).NoContextRestore();
        }
        catch (DirectoryNotFoundException ex)
        {
            throw new FileNotFoundException($"File '{path}' isn't found because its parent directory doesn't exist.", ex);
        }
        catch (Exception ex) when (!(ex is IOException)) // IOException usually contains path already
        {
            throw new IOException($"Failed reading file '{path}'.", ex);
        }
    }
}
