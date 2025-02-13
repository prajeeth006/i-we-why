using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.DepositPrompt;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DepositPrompt;

public class DepositPromptClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IDepositPromptConfiguration> depositPromptConfiguration;

    public DepositPromptClientConfigProviderTests()
    {
        depositPromptConfiguration = new Mock<IDepositPromptConfiguration>();

        Target = new DepositPromptClientConfigProvider(depositPromptConfiguration.Object);
    }

    [Fact]
    public async Task ShouldReturnDepositPromptConfig()
    {
        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        depositPromptConfiguration.Setup(c => c.Condition.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        depositPromptConfiguration.SetupGet(c => c.Trigger).Returns("Always");
        depositPromptConfiguration.SetupGet(c => c.RepeatTime).Returns(TimeSpan.FromMinutes(60));

        var config = await Target_GetConfigAsync();

        config["trigger"].Should().Be("Always");
        config["condition"].Should().BeSameAs(clientEvaluationResult);
        config["repeatTime"].Should().Be(3600000);
    }
}
