using System.IO;
using System.IO.Compression;

namespace Frontend.Vanilla.Core.IO.Compression;

/// <summary>
/// Deflate implementation of <see cref="ICompressor" />.
/// </summary>
internal interface IDeflateCompressor : ICompressor { }

internal sealed class DeflateCompressor : CompressorBase, IDeflateCompressor
{
    protected override Stream Compress(Stream streamToCompress, CompressionLevel level)
        => new DeflateStream(streamToCompress, level);

    protected override Stream Decompress(Stream streamToDecompress)
        => new DeflateStream(streamToDecompress, CompressionMode.Decompress);
}
