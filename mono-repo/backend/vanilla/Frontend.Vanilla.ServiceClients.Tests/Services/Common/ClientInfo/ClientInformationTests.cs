using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.ClientInfo;

public sealed class ClientInformationTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                ""brandId"": ""BWINCOM"",
                ""frontendId"": ""bz"",
                ""channelId"": ""WC"",
                ""productId"": ""SPORTSBOOK""
            }";

        // Act
        var result = ((IPosApiResponse<ClientInformation>)PosApiSerializationTester.Deserialize<ClientInformation>(json)).GetData();

        result.BrandId.Should().Be("BWINCOM");
        result.FrontendId.Should().Be("bz");
        result.ChannelId.Should().Be("WC");
        result.ProductId.Should().Be("SPORTSBOOK");
    }
}
