using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.IO;

/// <summary>
/// File system abstraction suited for Vanilla apps.
/// </summary>
internal interface IFileSystem
{
    /// <summary>Gets root directory where files current app are located.</summary>
    [DelegateTo(typeof(IAppDirectoryProvider), nameof(IAppDirectoryProvider.Directory))]
    RootedPath AppDirectory { get; }

    /// <summary>Returns <see cref="FileProperties" />, <see cref="DirectoryProperties"/> or null (if file system item doesn't exist).</summary>
    [DelegateTo(typeof(IGetPropertiesCommand), nameof(IGetPropertiesCommand.Get))]
    FileSystemProperties? GetProperties(RootedPath path);

    /// <summary>Returns <see cref="FileProperties" /> or null (if file doesn't exist). Throws <see cref="FileLoadException" /> if particular file system item isn't a file.</summary>
    [DelegateTo(typeof(IGetFilePropertiesCommand), nameof(IGetFilePropertiesCommand.Get))]
    FileProperties? GetFileProperties(RootedPath path);

    /// <exception cref="FileNotFoundException">If file or some directory on given path doesn't exist.</exception>
    [DelegateTo(typeof(IReadFileBytesCommand), nameof(IReadFileBytesCommand.ReadAsync))]
    byte[] ReadFileBytes(RootedPath path);

    /// <exception cref="FileNotFoundException">If file or some directory on given path doesn't exist.</exception>
    [DelegateTo(typeof(IReadFileBytesCommand), nameof(IReadFileBytesCommand.ReadAsync))]
    Task<byte[]> ReadFileBytesAsync(RootedPath path, CancellationToken cancellationToken);

    /// <exception cref="FileNotFoundException">If file or some directory on given path doesn't exist.</exception>
    [DelegateTo(typeof(IReadFileBytesCommand), nameof(IReadFileBytesCommand.ReadAsync))]
    Task<byte[]> ReadFileBytesAsync(ExecutionMode mode, RootedPath path);

    /// <exception cref="FileNotFoundException">If file or some directory on given path doesn't exist.</exception>
    [DelegateTo(typeof(IReadFileTextCommand), nameof(IReadFileTextCommand.ReadAsync))]
    string ReadFileText(RootedPath path);

    /// <exception cref="FileNotFoundException">If file or some directory on given path doesn't exist.</exception>
    [DelegateTo(typeof(IReadFileTextCommand), nameof(IReadFileTextCommand.ReadAsync))]
    Task<string> ReadFileTextAsync(RootedPath path, CancellationToken cancellationToken);

    /// <exception cref="FileNotFoundException">If file or some directory on given path doesn't exist.</exception>
    [DelegateTo(typeof(IReadFileTextCommand), nameof(IReadFileTextCommand.ReadAsync))]
    Task<string> ReadFileTextAsync(ExecutionMode mode, RootedPath path);

    [DelegateTo(typeof(IWriteFileTextCommand), nameof(IWriteFileTextCommand.WriteAsync))]
    void WriteFile(RootedPath path, string? text);

    /// <summary>Writes empty file if given null or empty. Also creates a parent directory.</summary>
    [DelegateTo(typeof(IWriteFileTextCommand), nameof(IWriteFileTextCommand.WriteAsync))]
    Task WriteFileAsync(RootedPath path, string? text, CancellationToken cancellationToken);

    [DelegateTo(typeof(IWriteFileTextCommand), nameof(IWriteFileTextCommand.AppendToFileAsync))]
    void AppendToFile(RootedPath path, string? text);

    /// <summary>Appends to the end of file. Writes empty file if given null or empty. Also creates a parent directory.</summary>
    [DelegateTo(typeof(IWriteFileTextCommand), nameof(IWriteFileTextCommand.AppendToFileAsync))]
    Task AppendToFileAsync(RootedPath path, string? text, CancellationToken cancellationToken);

    /// <summary>Writes empty file if given null or empty. Also creates a parent directory.</summary>
    [DelegateTo(typeof(IWriteFileTextCommand), nameof(IWriteFileTextCommand.WriteAsync))]
    Task WriteFileAsync(ExecutionMode mode, RootedPath path, string? text);

    /// <summary>Writes empty file if given null or empty. Also creates a parent directory.</summary>
    [DelegateTo(typeof(IWatchFileCommand), nameof(IWatchFileCommand.Watch))]
    IChangeToken WatchFile(RootedPath path);

    /// <summary>Deletes given file.</summary>
    [DelegateTo(typeof(IDeleteFileCommand), nameof(IDeleteFileCommand.Delete))]
    void DeleteFile(RootedPath path);
}
