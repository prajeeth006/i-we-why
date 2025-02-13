using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO;

public sealed class StreamExtensionsTests
{
    private TestStream stream;
    private MemoryStream destination;
    private CancellationToken ct;

    public StreamExtensionsTests()
    {
        stream = new TestStream();
        destination = new MemoryStream();
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public void ReadAllBytes_ShouldReadCorrectly()
        => stream.ReadAllBytes().Should().Equal(GetTestBytes());

    [Fact]
    public async Task ReadAllBytesAsync_ShouldReadCorrectly()
    {
        // Act
        var result = await stream.ReadAllBytesAsync(ct);

        result.Should().Equal(GetTestBytes());
        stream.ReceivedCT.Should().Be(ct);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task ReadAllBytesAsync_ExecutionMode_ShouldReadCorrectly(bool isAsync)
    {
        var mode = GetMode(isAsync);

        // Act
        var result = await stream.ReadAllBytesAsync(mode);

        result.Should().Equal(GetTestBytes());
        stream.ReceivedCT.Should().Be(mode.AsyncCancellationToken);
    }

    [Fact]
    public async Task CopyToAsync_ShouldCopyCorrectly()
    {
        // Act
        await stream.CopyToAsync(destination, ct);

        destination.ToArray().Should().Equal(GetTestBytes());
        stream.ReceivedCT.Should().Be(ct);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task CopyToAsync_ExecutionMode_ShouldCopyCorrectly(bool isAsync)
    {
        var mode = GetMode(isAsync);

        // Act
        await stream.CopyToAsync(mode, destination);

        destination.ToArray().Should().Equal(GetTestBytes());
        stream.ReceivedCT.Should().Be(mode.AsyncCancellationToken);
    }

    [Fact]
    public void Write_ShouldWriteAllBytes()
    {
        stream.Memory = new MemoryStream();

        // Act
        stream.Write(GetTestBytes());

        stream.Memory.ToArray().Should().Equal(GetTestBytes());
    }

    [Fact]
    public async Task WriteAsync_ShouldWriteAllBytes()
    {
        stream.Memory = new MemoryStream();

        // Act
        await stream.WriteAsync(GetTestBytes(), ct);

        stream.Memory.ToArray().Should().Equal(GetTestBytes());
        stream.ReceivedCT.Should().Be(ct);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public Task WriteAsync_ExecutionMode_ShouldWriteAllBytes(bool isAsync)
        => RunWriteAsyncTest(isAsync, 0, 5, m => stream.WriteAsync(m, GetTestBytes()));

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public Task WriteAsync_ExecutionMode_ShouldWriteSpecifiedRange(bool isAsync)
        => RunWriteAsyncTest(isAsync, 1, 2, m => stream.WriteAsync(m, GetTestBytes(), 1, 2));

    private async Task RunWriteAsyncTest(bool isAsync, int offset, int count, Func<ExecutionMode, Task> act)
    {
        stream.Memory = new MemoryStream();
        var mode = GetMode(isAsync);

        await act(mode);

        stream.Memory.ToArray().Should().Equal(GetTestBytes().Skip(offset).Take(count));
        stream.ReceivedCT.Should().Be(mode.AsyncCancellationToken);
    }

    private static byte[] GetTestBytes()
        => new byte[] { 0x12, 0xF3, 0x8D, 0x45, 0xA6 };

    private ExecutionMode GetMode(bool isAsync)
        => isAsync ? ExecutionMode.Async(ct) : ExecutionMode.Sync;

    private class TestStream : Stream
    {
        public MemoryStream Memory { get; set; } = new MemoryStream(GetTestBytes());
        public CancellationToken? ReceivedCT { get; private set; }

        public override async Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            await Task.Yield(); // Causes real async execution
            ReceivedCT = cancellationToken;

            return await Memory.ReadAsync(buffer, offset, count, cancellationToken);
        }

        public override async Task WriteAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            await Task.Yield(); // Causes real async execution
            ReceivedCT = cancellationToken;
            await Memory.WriteAsync(buffer, offset, count, cancellationToken);
        }

        public override int Read(byte[] buffer, int offset, int count) => Memory.Read(buffer, offset, count);
        public override void Flush() => throw new InvalidOperationException();
        public override long Seek(long offset, SeekOrigin origin) => throw new InvalidOperationException();
        public override void SetLength(long value) => throw new InvalidOperationException();
        public override void Write(byte[] buffer, int offset, int count) => Memory.Write(buffer, offset, count);
        public override bool CanRead => Memory.CanRead;
        public override bool CanSeek => true;
        public override bool CanWrite => true;
        public override long Length => Memory.Length;

        public override long Position
        {
            get => Memory.Position;
            set => throw new InvalidOperationException();
        }
    }
}
