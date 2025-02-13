using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class BonusBalanceDslProviderTests
{
    private readonly IBonusBalanceDslProvider target;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private readonly ExecutionMode mode;

    public BonusBalanceDslProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        target = new BonusBalanceDslProvider(currentUserAccessor.Object, posApiCrmService.Object);

        mode = TestExecutionMode.Get();
        var bonusBalance = new Dictionary<string, ProductBonusInfo>
        {
            ["CASINO"] = new ProductBonusInfo(new[]
            {
                new Bonus(10, true, new List<string> { "CASINO" }),
                new Bonus(20, true, new List<string> { "CASINO" }),
            }),
            ["BINGO"] = new ProductBonusInfo(new[]
            {
                new Bonus(30.1m, true, new List<string> { "BINGO" }),
                new Bonus(40.1m, true, new List<string> { "BINGO" }),
            }),
            ["MULTI"] = new ProductBonusInfo(new[]
            {
                new Bonus(50.2m, true, new List<string> { "CASINO", "BINGO" }),
                new Bonus(60.2m, true, new List<string> { "CASINO", "SPORTS" }),
            }),
        };

        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiCrmService.Setup(s => s.GetBonusBalanceAsync(mode, true)).ReturnsAsync(bonusBalance);
    }

    public static readonly IEnumerable<object[]> BonusBalanceTestCases = new[]
    {
        new object[] { "CASINO", 30.0m },
        new object[] { "BINGO", 70.2m },
        new object[] { "SPORTS", 0m },
        new object[] { "POKER", 0m },
    };

    [Theory, MemberData(nameof(BonusBalanceTestCases))]
    public async Task GetAsync_ShouldGetBonusBalanceForProduct(string product, decimal expected)
    {
        // Act
        var result = await target.GetBonusByTypeAsync(mode, product);

        result.Should().Be(expected);
    }

    public static readonly IEnumerable<object[]> BonusBalanceByTypeTestCases = new[]
    {
        new object[] { "CASINO", 140.4m },
        new object[] { "BINGO", 120.4m },
        new object[] { "SPORTS", 60.2m },
        new object[] { "POKER", 0m },
    };

    [Theory, MemberData(nameof(BonusBalanceByTypeTestCases))]
    public async Task GetAsync_ShouldGetBonusBalanceByBonusType(string product, decimal expected)
    {
        // Act
        var result = await target.GetAsync(mode, product);

        result.Should().Be(expected);
    }

    [Fact]
    public async Task GetAsync_ShouldNotGetBonusBalance_IfAnonymous()
    {
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act
        var result = await target.GetAsync(mode, "CASINO");

        result.Should().Be(BalanceDslExecutor.AnonymousValue);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetBonusBalanceAsync(It.IsAny<ExecutionMode>(), default), Times.Never);
    }
}
