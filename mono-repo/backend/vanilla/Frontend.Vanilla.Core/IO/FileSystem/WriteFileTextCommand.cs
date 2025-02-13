using System;
using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IWriteFileTextCommand
{
    Task AppendToFileAsync(ExecutionMode mode, RootedPath path, string text);
    Task WriteAsync(ExecutionMode mode, RootedPath path, string text);
}

internal sealed class WriteFileTextCommand : IWriteFileTextCommand
{
    public async Task AppendToFileAsync(ExecutionMode mode, RootedPath path, string text)
    {
        await Write(mode, path, text, FileMode.Append);
    }

    public async Task WriteAsync(ExecutionMode mode, RootedPath path, string text)
    {
        await Write(mode, path, text, FileMode.Create);
    }

    private async Task Write(ExecutionMode mode, RootedPath path, string text, FileMode fileMode)
    {
        Guard.NotNull(path, nameof(path));

        try
        {
            var bytes = text?.EncodeToBytes() ?? Array.Empty<byte>();
            var parentDirectory = Path.GetDirectoryName(path);

            if (parentDirectory != null)
                Directory.CreateDirectory(parentDirectory);

            using (var stream = new FileStream(path, fileMode, FileAccess.Write, FileShare.None)) // none can touch it in the meantime
                await stream.WriteAsync(mode, bytes).NoContextRestore();
        }
        catch (Exception ex) when (!(ex is IOException)) // IOException usually contains path already
        {
            throw new IOException($"Failed writing file '{path}'.", ex);
        }
    }
}
