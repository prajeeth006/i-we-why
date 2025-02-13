using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.BalanceBreakdown;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.BalanceBreakdown;

public class BalanceBreakdownClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IMenuFactory> menuFactory;
    private readonly Mock<IBalanceBreakdownConfiguration> balanceBreakdownConfiguration;

    private readonly MenuItem balanceContent;
    private readonly MenuItem balanceContentNew;

    public BalanceBreakdownClientConfigProviderTests()
    {
        menuFactory = new Mock<IMenuFactory>();
        balanceBreakdownConfiguration = new Mock<IBalanceBreakdownConfiguration>();

        Target = new BalanceBreakdownClientConfigProvider(
            menuFactory.Object,
            balanceBreakdownConfiguration.Object,
            new TestLogger<BalanceBreakdownClientConfigProvider>());

        balanceContent = new MenuItem();
        balanceContentNew = new MenuItem();

        menuFactory.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/BalanceBreakdown2/MyBalance", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(balanceContent);
        menuFactory.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/BalanceBreakdownNew/MyBalance", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(balanceContentNew);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnBalanceBreakdownContent()
    {
        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        balanceBreakdownConfiguration.Setup(c => c.PaypalBalanceMessageEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        balanceBreakdownConfiguration.Setup(c => c.PaypalReleaseFundsEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        balanceBreakdownConfiguration.SetupGet(c => c.UseV2).Returns(false);

        var config = await Target_GetConfigAsync();

        config["v2"].Should().Be(false);
        config["myBalanceContent"].Should().BeSameAs(balanceContent);
        config["isPaypalBalanceMessageEnabled"].Should().BeSameAs(clientEvaluationResult);
        config["isPaypalReleaseFundsEnabled"].Should().BeSameAs(clientEvaluationResult);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnBalanceBreakdownContentForV2()
    {
        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        balanceBreakdownConfiguration.Setup(c => c.PaypalBalanceMessageEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        balanceBreakdownConfiguration.Setup(c => c.PaypalReleaseFundsEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        balanceBreakdownConfiguration.SetupGet(c => c.UseV2).Returns(true);

        var config = await Target_GetConfigAsync();

        config["v2"].Should().Be(true);
        config["myBalanceContent"].Should().BeSameAs(balanceContentNew);
        config["isPaypalBalanceMessageEnabled"].Should().BeSameAs(clientEvaluationResult);
        config["isPaypalReleaseFundsEnabled"].Should().BeSameAs(clientEvaluationResult);
    }
}
