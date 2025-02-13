using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class LoginResultHandlerTests
{
    private readonly ILoginResultHandler target;
    private readonly Mock<ILoginService> loginServiceMock;
    private readonly Mock<IWebAuthenticationService> webAuthenticationServiceMock;
    private readonly Mock<ICookieHandler> cookieHandlerMock;
    private readonly Mock<IProductPlaceholderReplacer> productPlaceholderReplacerMock;
    private readonly Mock<IClaimsService> claimsServiceMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternalMock;
    private readonly Mock<IBalanceServiceClient> balanceServiceClientMock;
    private readonly Mock<ILogger<LoginResultHandler>> logMock;
    private readonly Balance balance;

    public LoginResultHandlerTests()
    {
        loginServiceMock = new Mock<ILoginService>();
        webAuthenticationServiceMock = new Mock<IWebAuthenticationService>();
        cookieHandlerMock = new Mock<ICookieHandler>();
        productPlaceholderReplacerMock = new Mock<IProductPlaceholderReplacer>();
        claimsServiceMock = new Mock<IClaimsService>();
        posApiCrmServiceInternalMock = new Mock<IPosApiCrmServiceInternal>();
        logMock = new Mock<ILogger<LoginResultHandler>>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        balanceServiceClientMock = new Mock<IBalanceServiceClient>();

        target = new LoginResultHandler(
            loginServiceMock.Object,
            webAuthenticationServiceMock.Object,
            cookieHandlerMock.Object,
            productPlaceholderReplacerMock.Object,
            claimsServiceMock.Object,
            currentUserAccessorMock.Object,
            balanceServiceClientMock.Object,
            posApiCrmServiceInternalMock.Object,
            logMock.Object);

        balance = new Balance(new Currency("EUR", "Euro"), accountBalance: 10M);
        balanceServiceClientMock.Setup(c => c.GetAsync(It.IsAny<ExecutionMode>(), true)).ReturnsAsync(balance);
        posApiCrmServiceInternalMock.Setup(c => c.GetBasicLoyaltyProfileAsync(It.IsAny<CancellationToken>(), true)).ReturnsAsync(new BasicLoyaltyProfile("C"));
    }

    [Fact]
    public async Task LoginSuccess()
    {
        var testUser = TestUser.Get(AuthState.Authenticated);
        currentUserAccessorMock.SetupGet(c => c.User).Returns(testUser);
        loginServiceMock.Setup(c => c.Login(It.IsAny<MobileLoginParameters>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LoginInfo());
        var result = (OkObjectResult)await target.LoginAsync(new MobileLoginParameters(), It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo(new { IsCompleted = true, RememberMeEnabled = false, User = new UserInfo(true, "C"), Balance = balance, Claims = testUser.Claims.Where(c => !string.IsNullOrEmpty(c.Value)).ToDictionary(c => c.Type, c => c.Value) });
        balanceServiceClientMock.Verify(c => c.GetAsync(It.IsAny<ExecutionMode>(), true), Times.Once);
        posApiCrmServiceInternalMock.Verify(c => c.GetBasicLoyaltyProfileAsync(It.IsAny<CancellationToken>(), true), Times.Once);
    }

    [Fact]
    public async Task LoginRedirect()
    {
        var testUser = TestUser.Get(AuthState.Workflow);
        currentUserAccessorMock.SetupGet(c => c.User).Returns(testUser);
        loginServiceMock.Setup(c => c.Login(It.IsAny<MobileLoginParameters>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LoginInfo()
            {
                Status = LoginStatus.Redirect, PostLoginRedirect = new KeyValuePair<string, PostLoginRedirect>("bla", new PostLoginRedirect
                {
                    Options = new PostLoginRedirectOptions() { WorkflowMode = true, },
                    Action = "cashier",
                }),
            });
        var result = (OkObjectResult)await target.LoginAsync(new MobileLoginParameters(), It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo(new { IsCompleted = false, RememberMeEnabled = false, User = new UserInfo(false, "C"), Balance = balance, Action = "cashier", Claims = testUser.Claims.Where(c => !string.IsNullOrEmpty(c.Value)).ToDictionary(c => c.Type, c => c.Value) });
        balanceServiceClientMock.Verify(c => c.GetAsync(It.IsAny<ExecutionMode>(), true), Times.Once);
        posApiCrmServiceInternalMock.Verify(c => c.GetBasicLoyaltyProfileAsync(It.IsAny<CancellationToken>(), true), Times.Once);
    }

    [Fact]
    public async Task LoginError()
    {
        loginServiceMock.Setup(c => c.Login(It.IsAny<MobileLoginParameters>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LoginInfo()
            {
                Status = LoginStatus.Error, ErrorCode = "25", PosApiErrorMessage = "fail login",
            });
        var result = (KeyValueMessageResult)await target.LoginAsync(new MobileLoginParameters(), It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo("fail login");
        result.InnerResult.Should().BeEquivalentTo(new { StatusCode = 400 });
        balanceServiceClientMock.Verify(c => c.GetAsync(It.IsAny<ExecutionMode>(), true), Times.Never);
        posApiCrmServiceInternalMock.Verify(c => c.GetBasicLoyaltyProfileAsync(It.IsAny<CancellationToken>(), true), Times.Never);
    }
}
