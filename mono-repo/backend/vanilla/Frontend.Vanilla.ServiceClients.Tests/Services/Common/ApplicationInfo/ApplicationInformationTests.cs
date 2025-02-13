using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.ApplicationInfo;

public sealed class ApplicationInformationTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        // Act
        var result = PosApiSerializationTester.Deserialize<ApplicationInformation>(@"{
                ""name"": ""BWINCOM test"",
                ""allRating"": 4.3
            }");

        result.Name.Should().Be("BWINCOM test");
        result.AllRating.Should().Be(4.3m);
    }
}
