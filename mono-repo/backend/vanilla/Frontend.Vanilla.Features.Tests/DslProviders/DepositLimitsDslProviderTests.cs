using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public sealed class DepositLimitsDslProviderTests
{
    private IDepositLimitsDslProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;

    private readonly ExecutionMode mode;

    public DepositLimitsDslProviderTests()
    {
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();
        mode = TestExecutionMode.Get();
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiResponsibleGamingServiceMock.Setup(p => p.GetDepositLimitsAsync(mode)).ReturnsAsync(new List<DepositLimit>()
        {
            new DepositLimit(200, "Daily", true),
            new DepositLimit(null, "Weekly", false),
        });

        target = new DepositLimitsDslProvider(currentUserAccessorMock.Object, posApiResponsibleGamingServiceMock.Object);
    }

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { "Daily", 200 },
        new object[] { "Weekly", -1 },
    };

    [Theory, MemberData(nameof(TestCases))]
    public async Task ShouldGetCategoryForAuthenticatedUser(string type, decimal expected)
    {
        var result = await target.GetAsync(mode, type);

        result.Should().Be(expected);
    }
}
