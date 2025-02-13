using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.SecurityQuestions;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.SecurityQuestions;

public sealed class SecurityQuestionTests
{
    [Fact]
    public void GetBeDeserializedCorrectly()
    {
        const string json = @"{
                ""SecurityQuestions"": [
                    { ""question"": ""Question text One"", ""id"": ""1"" },
                    { ""question"": ""Question text Two"", ""id"": ""2"" },
                    { ""question"": ""Question text Three"", ""id"": ""3"" }
                ]
            }";

        // Act
        var questions = PosApiSerializationTester.Deserialize<SecurityQuestionResponse>(json).GetData();

        questions.Should().MatchItems(
            q => q.Id == "1" && q.Question == "Question text One",
            q => q.Id == "2" && q.Question == "Question text Two",
            q => q.Id == "3" && q.Question == "Question text Three");
    }
}
