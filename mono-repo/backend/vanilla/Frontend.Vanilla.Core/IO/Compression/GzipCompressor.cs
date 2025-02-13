using System.IO;
using System.IO.Compression;

namespace Frontend.Vanilla.Core.IO.Compression;

/// <summary>
/// GZIP implementation of <see cref="ICompressor" />.
/// </summary>
internal interface IGzipCompressor : ICompressor { }

internal sealed class GzipCompressor : CompressorBase, IGzipCompressor
{
    protected override Stream Compress(Stream streamToCompress, CompressionLevel level)
        => new GZipStream(streamToCompress, level);

    protected override Stream Decompress(Stream streamToDecompress)
        => new GZipStream(streamToDecompress, CompressionMode.Decompress);
}
