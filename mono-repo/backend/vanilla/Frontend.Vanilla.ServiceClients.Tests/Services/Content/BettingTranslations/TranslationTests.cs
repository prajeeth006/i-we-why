using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Content.BettingTranslations;

public sealed class TranslationTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                ""id"": ""14"",
                ""name"": ""ball""
            }";

        // Act
        var result = ((IPosApiResponse<Translation>)PosApiSerializationTester.Deserialize<Translation>(json)).GetData();

        result.Id.Should().Be(14);
        result.Name.Should().Be("ball");
    }
}
