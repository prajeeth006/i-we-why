using System.IO;
using System.IO.Compression;

namespace Frontend.Vanilla.Core.IO.Compression;

/// <summary>
/// Brotli implementation of <see cref="ICompressor" />.
/// </summary>
internal interface IBrotliCompressor : ICompressor { }

internal class BrotliCompressor : CompressorBase, IBrotliCompressor
{
    protected override Stream Compress(Stream streamToCompress, CompressionLevel level)
        => new BrotliStream(streamToCompress, level);

    protected override Stream Decompress(Stream streamToDecompress)
        => new BrotliStream(streamToDecompress, CompressionMode.Decompress);
}
