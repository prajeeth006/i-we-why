using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.CommunicationSettings;

public sealed class CommunicationTypeTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        var json = @"{
                ""CommunicationTypes"": [
                    { ""id"": 1, ""name"":""Email"", ""selected"": true },
                    { ""id"": 2, ""name"": ""Phone"", ""selected"": false }
                ],
                ""CommunicationProducts"": [
                    {
                        ""id"": 123,
                        ""name"": ""Sports"",
                        ""CommunicationTypes"": [
                            { ""id"": 1, ""name"": ""Newsletter"", ""selected"": true },
                            { ""id"": 2, ""name"": ""Special offers"", ""selected"": false }
                        ]
                    }
                ]
            }";

        var response = PosApiSerializationTester.Deserialize<CommunicationSettingsResponse>(json).GetData(); // Act

        response.Should().BeEquivalentTo(new[]
        {
            new CommunicationType(id: 1, name: "Email", selected: true),
            new CommunicationType(id: 2, name: "Phone", selected: false),
        });
    }
}
