using System.IO;
using System.IO.Compression;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.IO.Compression;

/// <summary>
/// Wraps compression algorithm.
/// </summary>
internal interface ICompressor
{
    byte[] Compress(byte[] bytes, CompressionLevel level);
    byte[] Decompress(byte[] bytes);
}

internal abstract class CompressorBase : ICompressor
{
    public byte[] Compress(byte[] bytes, CompressionLevel level)
    {
        var result = new MemoryStream(capacity: bytes.Length);
        using (var compressingStream = Compress(result, level))
            compressingStream.Write(bytes);

        return result.ToArray();
    }

    public byte[] Decompress(byte[] bytes)
    {
        var result = new MemoryStream(capacity: 2 * bytes.Length);
        using (var decompressingStream = Decompress(new MemoryStream(bytes, writable: false)))
            decompressingStream.CopyTo(result);

        return result.ToArray();
    }

    protected abstract Stream Compress(Stream streamToCompress, CompressionLevel level);
    protected abstract Stream Decompress(Stream streamToDecompress);
}
