using FluentAssertions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebUtilities;

public class EndpointMetadataBaseTests
{
    private IEndpointMetadata target;
    private Mock<EndpointMetadataBase> underlyingMock;

    public EndpointMetadataBaseTests()
    {
        underlyingMock = new Mock<EndpointMetadataBase>();
        target = underlyingMock.Object;

        underlyingMock.Setup(m => m.GetOrdered<string>()).Returns(new[] { "a", "b", "c" });
    }

    [Fact]
    public void Get_ShouldReturnLast()
        => target.Get<string>().Should().Be("c");

    [Fact]
    public void Get_ShouldReturnNull_IfNoMetadata()
    {
        underlyingMock.Setup(m => m.GetOrdered<string>()).ReturnsEmpty();

        // Act
        target.Get<string>().Should().BeNull();
    }

    [Fact]
    public void Contains_ShouldReturnTrue_IfMetadataExist()
        => target.Contains<string>().Should().BeTrue();

    [Fact]
    public void Contains_ShouldReturnFalse_IfNoMetadata()
    {
        underlyingMock.Setup(m => m.GetOrdered<string>()).ReturnsEmpty();

        // Act
        target.Contains<string>().Should().BeFalse();
    }
}
