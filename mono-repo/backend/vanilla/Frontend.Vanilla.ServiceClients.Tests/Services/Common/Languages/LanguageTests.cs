using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Languages;

public sealed class LanguageTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{ ""Languages"": [
                {""id"":""EN"",""name"":""english"",""translatedName"":""English"",""platformId"":""en_US"",""cultureName"":""en-US""},
                {""id"":""DE"",""name"":""deutsch"",""translatedName"":""German"",""platformId"":""de_DE"",""cultureName"":""de-DE""},
            ]}";

        // Act
        var target = PosApiSerializationTester.Deserialize<LanguagesResponse>(json).Languages;

        target.Should().BeEquivalentTo(new[]
        {
            new Language(cultureName: "en-US", translatedName: "English", platformId: "en_US"),
            new Language(cultureName: "de-DE", translatedName: "German", platformId: "de_DE"),
        });
    }
}
