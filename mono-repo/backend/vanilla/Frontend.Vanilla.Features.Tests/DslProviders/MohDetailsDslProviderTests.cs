using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class MohDetailsDslProviderTests
{
    private IMohDetailsDslProvider target;
    private Mock<IPosApiAccountServiceInternal> posApiAccountService;
    private Mock<ICurrentUserAccessor> currentUserAccessor;

    public MohDetailsDslProviderTests()
    {
        posApiAccountService = new Mock<IPosApiAccountServiceInternal>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);

        target = new MohDetailsDslProvider(posApiAccountService.Object, currentUserAccessor.Object);
    }

    [Fact]
    public async Task ShallReturnCorrectValuesForAuthenticatedUser()
    {
        posApiAccountService.Setup(p => p.GetMohDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()))
            .ReturnsAsync(new MohDetailsResponse("comment", "GB", 1, 2, 3, 4, 5, 6, "test", "vip"));

        // Act & assert
        (await target.GetCommentsAsync(default)).Should().Be("comment");
        (await target.GetCountryCodeAsync(default)).Should().Be("GB");
        (await target.GetExclDaysAsync(default)).Should().Be(1);
        (await target.GetMohPrimaryReasonCodeAsync(default)).Should().Be(2);
        (await target.GetMohPrimaryRiskBandCodeAsync(default)).Should().Be(3);
        (await target.GetMohPrimaryProductCodeAsync(default)).Should().Be(4);
        (await target.GetMohPrimaryToolCodeAsync(default)).Should().Be(5);
        (await target.GetMohScoreAsync(default)).Should().Be(6);
        (await target.GetProcessedAsync(default)).Should().Be("test");
        (await target.GetVipUserAsync(default)).Should().Be("vip");
    }

    [Fact]
    public async Task ShallReturnDefaultValuesForUnauthenticatedUser()
    {
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act & assert
        (await target.GetCommentsAsync(default)).Should().BeNullOrEmpty();
        (await target.GetCountryCodeAsync(default)).Should().BeNullOrEmpty();
        (await target.GetExclDaysAsync(default)).Should().Be(0);
        (await target.GetMohPrimaryReasonCodeAsync(default)).Should().Be(0);
        (await target.GetMohPrimaryRiskBandCodeAsync(default)).Should().Be(0);
        (await target.GetMohPrimaryProductCodeAsync(default)).Should().Be(0);
        (await target.GetMohPrimaryToolCodeAsync(default)).Should().Be(0);
        (await target.GetMohScoreAsync(default)).Should().Be(0);
        (await target.GetProcessedAsync(default)).Should().BeNullOrEmpty();
        (await target.GetVipUserAsync(default)).Should().BeNullOrEmpty();
    }
}
