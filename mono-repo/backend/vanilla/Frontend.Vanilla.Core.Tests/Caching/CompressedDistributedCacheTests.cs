using System.IO.Compression;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.IO.Compression;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching;

public class CompressedDistributedCacheTests
{
    private IDistributedCache target;
    private Mock<IDistributedCache> inner;
    private Mock<IDeflateCompressor> compressor;

    private byte[] testBytes1;
    private byte[] testBytes2;
    private DistributedCacheEntryOptions options;

    public CompressedDistributedCacheTests()
    {
        inner = new Mock<IDistributedCache>();
        compressor = new Mock<IDeflateCompressor>();
        target = new CompressedDistributedCache(inner.Object, compressor.Object);

        testBytes1 = "Hello there.".EncodeToBytes();
        testBytes2 = "General Kenobi!".EncodeToBytes();
        options = new DistributedCacheEntryOptions();
        inner.SetReturnsDefault<byte[]>(null);
    }

    [Fact]
    public async Task GetAsync_ShouldNotDecompress_IfNull()
    {
        inner.SetupWithAnyArgs(i => i.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(() => null);

        var result = await target.GetAsync("key", TestContext.Current.CancellationToken); // Act

        result.Should().BeNull();
        inner.Verify(i => i.GetAsync("key", TestContext.Current.CancellationToken));
        compressor.VerifyWithAnyArgs(c => c.Decompress(null), Times.Never);
    }

    [Fact]
    public async Task GetAsync_ShouldDecompressData()
    {
        inner.SetupWithAnyArgs(i => i.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(testBytes1);
        compressor.SetupWithAnyArgs(c => c.Decompress(null)).Returns(testBytes2);

        var result = await target.GetAsync("key", TestContext.Current.CancellationToken); // Act

        result.Should().BeSameAs(testBytes2);
        inner.Verify(i => i.GetAsync("key", TestContext.Current.CancellationToken));
        compressor.Verify(c => c.Decompress(testBytes1));
    }

    [Fact]
    public async Task SetAsync_ShouldCompressData()
    {
        compressor.SetupWithAnyArgs(c => c.Compress(null, default)).Returns(testBytes2);

        await target.SetAsync("key", testBytes1, options, TestContext.Current.CancellationToken); // Act

        inner.Verify(i => i.SetAsync("key", testBytes2, options, TestContext.Current.CancellationToken));
        compressor.Verify(c => c.Compress(testBytes1, CompressionLevel.Fastest));
    }

    [Fact]
    public async Task RefreshAsync_ShouldDelegateToInner()
    {
        await target.RefreshAsync("key", TestContext.Current.CancellationToken); // Act
        inner.Verify(i => i.RefreshAsync("key", TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task RemoveAsync_ShouldDelegateToInner()
    {
        await target.RemoveAsync("key", TestContext.Current.CancellationToken); // Act
        inner.Verify(i => i.RemoveAsync("key", TestContext.Current.CancellationToken));
    }
}
