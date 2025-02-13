using System.Security.Cryptography;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Utils;

public sealed class HashAlgorithmTests
{
    [Fact]
    public void ShouldCalculateHash()
    {
#pragma warning disable SYSLIB0021 // Type or member is obsolete
        IHashAlgorithm<SHA1Managed> target = new HashAlgorithm<SHA1Managed>();
#pragma warning restore SYSLIB0021 // Type or member is obsolete
        var bytes = "Hello bwin".EncodeToBytes();

        // Act
        var hash = target.CalculateHash(bytes);

        hash.Should().Be("B8GU1q0zFULdI/Xnq8q0zDDXYn8=");
    }
}
