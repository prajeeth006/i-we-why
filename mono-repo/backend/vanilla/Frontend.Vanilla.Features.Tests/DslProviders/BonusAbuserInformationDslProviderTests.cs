using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders
{
    public class BonusAbuserInformationDslProviderTests
    {
        private readonly IBonusAbuserInformationDslProvider target;
        private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
        private readonly Mock<IPosApiAccountServiceInternal> posApiAccountServiceMock;

        private readonly ExecutionMode mode;

        public BonusAbuserInformationDslProviderTests()
        {
            currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
            posApiAccountServiceMock = new Mock<IPosApiAccountServiceInternal>();

            target = new BonusAbuserInformationDslProvider(posApiAccountServiceMock.Object, currentUserAccessorMock.Object);

            mode = TestExecutionMode.Get();

            currentUserAccessorMock.SetupGet(c => c.User).Returns(() => TestUser.Get(AuthState.Authenticated));
        }

        [Fact]
        public async Task GetIsBonusAbuserAsync_ShouldReturnTrue_IfUserIsBonusAbuser()
        {
            posApiAccountServiceMock.Setup(m => m.GetDnaAbuserInformationAsync(mode))
                .ReturnsAsync(new BonusAbuserInformationResponse(isBonusAbuser: true));

            var result = await target.GetIsBonusAbuserAsync(mode);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task GetIsBonusAbuserAsync_ShouldReturnFalse_ForAnonymousUser()
        {
            posApiAccountServiceMock.Setup(m => m.GetDnaAbuserInformationAsync(mode))
                .ReturnsAsync(new BonusAbuserInformationResponse(isBonusAbuser: true));

            currentUserAccessorMock.SetupGet(c => c.User).Returns(() => TestUser.Get());

            var result = await target.GetIsBonusAbuserAsync(mode);

            result.Should().BeFalse();
        }
    }
}
