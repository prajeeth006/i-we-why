using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public sealed class TerminalDslProviderTests
{
    private readonly ITerminalDslProvider target;
    private readonly Mock<ICookieHandler> cookieHandlerMock;
    private readonly Mock<IPosApiCommonServiceInternal> posApiCommonServiceInternalMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private readonly ExecutionMode mode;
    private readonly TerminalDetailsResponse response;

    public TerminalDslProviderTests()
    {
        mode = TestExecutionMode.Get();
        response = new TerminalDetailsResponse("online", new TerminalDetailsData(
            "TerminalType",
            "IpAddress",
            "MacId",
            4,
            "TerminalStatus",
            "Resolution",
            "LockStatus",
            new TerminalCustomerAccount("CustomerId", "AccountName")));

        posApiCommonServiceInternalMock = new Mock<IPosApiCommonServiceInternal>();
        posApiCommonServiceInternalMock.Setup(s => s.GetTerminalDetailsAsync(mode, It.IsAny<TerminalDetailsRequest>()))
            .ReturnsAsync(response);

        cookieHandlerMock = new Mock<ICookieHandler>();
        cookieHandlerMock.Setup(x => x.GetValue(It.IsAny<string>())).Returns("123");

        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        currentUserAccessorMock.SetupGet(a => a.User).Returns(TestUser.Get(AuthState.Authenticated));

        target = new TerminalDslProvider(posApiCommonServiceInternalMock.Object, cookieHandlerMock.Object, currentUserAccessorMock.Object);
    }

    [Fact]
    public void TerminalId_ShouldHaveCorrectValue()
    {
        // Setup
        cookieHandlerMock.Setup(o => o.GetValue(CookieConstants.TerminalId)).Returns("2");

        // Assert
        target.TerminalId.Should().Be("2");
    }

    [Fact]
    public async Task GetStatusAsync_ShouldHaveCorrectValue()
        => (await target.GetStatusAsync(mode)).Should().Be(response.Status);

    [Fact]
    public async Task GetResolutionAsync_ShouldHaveCorrectValue()
        => (await target.GetResolutionAsync(mode)).Should().Be(response.Data.Resolution);

    [Fact]
    public async Task GetIpAddressAsync_ShouldHaveCorrectValue()
        => (await target.GetIpAddressAsync(mode)).Should().Be(response.Data.IpAddress);

    [Fact]
    public async Task GetLockStatusAsync_ShouldHaveCorrectValue()
        => (await target.GetLockStatusAsync(mode)).Should().Be(response.Data.LockStatus);

    [Fact]
    public async Task GetMacIdAsync_ShouldHaveCorrectValue()
        => (await target.GetMacIdAsync(mode)).Should().Be(response.Data.MacId);

    [Fact]
    public async Task GetTerminalStatusAsync_ShouldHaveCorrectValue()
        => (await target.GetTerminalStatusAsync(mode)).Should().Be(response.Data.TerminalStatus);

    [Fact]
    public async Task GetTypeAsync_ShouldHaveCorrectValue()
        => (await target.GetTypeAsync(mode)).Should().Be(response.Data.TerminalType);

    [Fact]
    public async Task GetVolumeAsync_ShouldHaveCorrectValue()
        => (await target.GetVolumeAsync(mode)).Should().Be(response.Data.Volume.ToString());

    [Fact]
    public async Task GetAccountNameAsync_ShouldHaveCorrectValue()
        => (await target.GetAccountNameAsync(mode)).Should().Be(response.Data.CustomerAccount.AccountName);

    [Fact]
    public async Task GetCustomerIdAsync_ShouldHaveCorrectValue()
        => (await target.GetCustomerIdAsync(mode)).Should().Be(response.Data.CustomerAccount.CustomerId);

    [Fact]
    public async Task GetCustomerIdAsync_ShouldReturnDefaultValue_ForUnauthenticatedUser()
    {
        // Setup
        currentUserAccessorMock.SetupGet(a => a.User).Returns(TestUser.Get());

        // Act
        var result = await target.GetCustomerIdAsync(mode);

        // Assert
        result.Should().Be(string.Empty);
        posApiCommonServiceInternalMock.VerifyWithAnyArgs(x => x.GetTerminalDetailsAsync(default, default), Times.Never);
    }
}
