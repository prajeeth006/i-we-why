using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Infrastructure;

public class ClientContentServiceOptionsTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var target = new ClientContentServiceOptions();

        target.Mappings.IsReadOnly.Should().BeFalse();
    }
}
