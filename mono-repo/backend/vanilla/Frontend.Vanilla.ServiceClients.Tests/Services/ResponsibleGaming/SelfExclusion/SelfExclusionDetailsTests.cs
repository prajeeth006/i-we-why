using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.SelfExclusion;

public class SelfExclusionDetailsTests
{
    [Fact]
    public void ShouldDeserializeCorrectlyFromPosApi()
    {
        const string json = @"{
                ""categoryId"": ""1234"",
            }";

        // Act
        var result = PosApiSerializationTester.Deserialize<SelfExclusionDetails>(json);

        result.Should().BeEquivalentTo(new SelfExclusionDetails(
            "1234", null, null));
    }
}
