using System.IO.Compression;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.IO.Compression;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Core.Caching;

/// <summary>
/// (De)compresses data read from or written to <see cref="IDistributedCache" />
/// hence minimazing size (by more then 50%) of the data being transmitted over network and stored in decorated cache.
/// </summary>
internal sealed class CompressedDistributedCache(IDistributedCache inner, IDeflateCompressor compressor)
    : DistributedCacheBase
{
    private readonly ICompressor compressor = compressor;

    // We use Deflate b/c it's faster than GZip which adds CRC and Brotli would require additional NuGet dependency.
    // See https://blogs.msdn.microsoft.com/shacorn/2014/11/12/optimizing-memory-footprint-compression-in-net-4-5/
    public override async Task<byte[]?> GetAsync(ExecutionMode mode, string key)
    {
        var compressed = await inner.GetAsync(mode, key);

        return compressed != null ? compressor.Decompress(compressed) : null;
    }

    public override Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
    {
        var compressed = compressor.Compress(value, CompressionLevel.Fastest);

        return inner.SetAsync(mode, key, compressed, options);
    }

    public override Task RefreshAsync(ExecutionMode mode, string key)
        => inner.RefreshAsync(mode, key);

    public override Task RemoveAsync(ExecutionMode mode, string key)
        => inner.RemoveAsync(mode, key);
}
