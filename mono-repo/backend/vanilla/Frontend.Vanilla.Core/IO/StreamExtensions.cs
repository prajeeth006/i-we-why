using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.IO;

/// <summary>
/// Extensions method for <see cref="Stream" />.
/// </summary>
internal static class StreamExtensions
{
    public const int CopyBufferSize = 81920;

    public static byte[] ReadAllBytes(this Stream stream)
    {
        var memory = AllocateCorrespondingMemory(stream);
        stream.CopyTo(memory);

        return memory.ToArray(); // No Dispose() b/c it's a memory, cleared when needed
    }

    public static async Task<byte[]> ReadAllBytesAsync(this Stream stream, CancellationToken cancellationToken)
    {
        var memory = AllocateCorrespondingMemory(stream);
        await stream.CopyToAsync(memory, cancellationToken).NoContextRestore();

        return memory.ToArray(); // No Dispose() b/c it's a memory, cleared when needed
    }

    private static MemoryStream AllocateCorrespondingMemory(Stream stream)
        => new MemoryStream(stream.CanSeek ? (int)Math.Min(stream.Length, int.MaxValue) : 0);

    public static Task<byte[]> ReadAllBytesAsync(this Stream stream, ExecutionMode mode)
        => mode.AsyncCancellationToken != null
            ? stream.ReadAllBytesAsync(mode.AsyncCancellationToken.Value)
            : Task.FromResult(stream.ReadAllBytes());

    public static Task CopyToAsync(this Stream stream, Stream destination, CancellationToken cancellationToken)
        => stream.CopyToAsync(destination, CopyBufferSize, cancellationToken);

    public static Task CopyToAsync(this Stream stream, ExecutionMode mode, Stream destination)
    {
        if (mode.AsyncCancellationToken != null)
            return stream.CopyToAsync(destination, mode.AsyncCancellationToken.Value);

        stream.CopyTo(destination, CopyBufferSize);

        return Task.CompletedTask;
    }

    public static void Write(this Stream stream, byte[] buffer)
        => stream.Write(buffer, offset: 0, buffer.Length);

    public static Task WriteAsync(this Stream stream, byte[] buffer, CancellationToken cancellationToken)
        => stream.WriteAsync(buffer, offset: 0, buffer.Length, cancellationToken);

    public static Task WriteAsync(this Stream stream, ExecutionMode mode, byte[] buffer)
        => stream.WriteAsync(mode, buffer, offset: 0, buffer.Length);

    public static Task WriteAsync(this Stream stream, ExecutionMode mode, byte[] buffer, int offset, int count)
    {
        if (mode.AsyncCancellationToken != null)
            return stream.WriteAsync(buffer, offset, count, mode.AsyncCancellationToken.Value);

        stream.Write(buffer, offset, count);

        return Task.CompletedTask;
    }
}
