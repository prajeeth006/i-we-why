using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.List;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.List;

public sealed class ListResponseTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"[ ""Austria"", ""Italy"", ""India"" ]";

        // Act
        var target = PosApiSerializationTester.Deserialize<ListResponse>(json).GetData();

        target.Should().Equal("Austria", "Italy", "India");
    }
}
