using System.IO;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.IO.FileSystem;

internal interface IGetFilePropertiesCommand
{
    FileProperties? Get(RootedPath path);
}

internal sealed class GetFilePropertiesCommand(IGetPropertiesCommand getPropertiesCommand) : IGetFilePropertiesCommand
{
    public FileProperties? Get(RootedPath path)
    {
        var properties = getPropertiesCommand.Get(path);

        switch (properties)
        {
            case null:
                return null;

            case FileProperties fileProperties:
                return fileProperties;

            case var unsupported:
                var message = $"File system item at path '{path}' isn't a file as expected but it's a {unsupported.GetType().Name.RemoveSuffix("Properties")}.";

                throw new FileLoadException(message, path);
        }
    }
}
