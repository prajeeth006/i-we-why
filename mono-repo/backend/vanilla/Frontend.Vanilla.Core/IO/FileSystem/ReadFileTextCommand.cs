using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IReadFileTextCommand
{
    Task<string> ReadAsync(ExecutionMode mode, RootedPath path);
}

internal sealed class ReadFileTextCommand(IReadFileBytesCommand readFileBytesCommand) : IReadFileTextCommand
{
    public async Task<string> ReadAsync(ExecutionMode mode, RootedPath path)
    {
        var bytes = await readFileBytesCommand.ReadAsync(mode, path).NoContextRestore();

        return bytes.DecodeToString();
    }
}
