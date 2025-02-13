using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.AntiForgery;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.User;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.User;

public class UserClientConfigProviderTests
{
    private const bool Cached = true;
    private readonly IClientConfigProvider target;
    private readonly Mock<ILanguageService> languageService;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<IDateTimeCultureBasedFormatter> dateTimeCultureBasedFormatter;
    private readonly Mock<ILastVisitorCookie> lastVisitorCookie;
    private readonly Mock<IPosApiAuthenticationService> posApiAuthenticationService;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private readonly Mock<IPosApiAccountServiceInternal> posApiAccountServiceMock;
    private readonly Mock<ILoginService> loginService;
    private readonly TestLogger<UserClientConfigProvider> log;
    private readonly Mock<IVisitorSettingsManager> visitorSettingsManager;
    private readonly Mock<IUserDslProvider> userDslProvider;
    private readonly CancellationToken ct;

    public UserClientConfigProviderTests()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("es-ES"));
        languageService = new Mock<ILanguageService>();
        currentUserAccessor = new Mock<ICurrentUserAccessor> { DefaultValue = DefaultValue.Mock };
        dateTimeCultureBasedFormatter = new Mock<IDateTimeCultureBasedFormatter>();
        lastVisitorCookie = new Mock<ILastVisitorCookie>();
        posApiAuthenticationService = new Mock<IPosApiAuthenticationService>();
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        posApiAccountServiceMock = new Mock<IPosApiAccountServiceInternal>();
        loginService = new Mock<ILoginService>();
        visitorSettingsManager = new Mock<IVisitorSettingsManager>();
        userDslProvider = new Mock<IUserDslProvider>();
        log = new TestLogger<UserClientConfigProvider>();
        ct = TestCancellationToken.Get();

        var antiForgeryToken = Mock.Of<IAntiForgeryToken>(t => t.GetValue() == "xxx");
        var clock = Mock.Of<IClock>(c => c.UtcNow == new UtcDateTime(2017, 12, 14, 0, 0, 0, 0));
        visitorSettingsManager.SetupProperty(m => m.Current, TestVisitorSettings.Get(
            lastSessionId: "last-id",
            visitCount: 666,
            sessionStartTime: new UtcDateTime(2001, 2, 3, 9, 47, 51)));

        SetupIdentity(AuthState.Anonymous);

        target = new UserClientConfigProvider(
            posApiAccountServiceMock.Object,
            currentUserAccessor.Object,
            languageService.Object,
            lastVisitorCookie.Object,
            posApiCrmService.Object,
            posApiAuthenticationService.Object,
            antiForgeryToken,
            loginService.Object,
            clock,
            dateTimeCultureBasedFormatter.Object,
            visitorSettingsManager.Object,
            userDslProvider.Object,
            log);

        languageService.SetupGet(r => r.Default).Returns(TestLanguageInfo.Get(routeValue: "de"));
    }

    private void SetupIdentity(AuthState authState)
        => currentUserAccessor.SetupGet(c => c.User).Returns(TestUser.Get(authState));

    [Fact]
    public void ShouldHaveCorrectName()
    {
        target.Name.Should().Be("vnUser");
    }

    [Fact]
    public async Task ShouldReturnUserValues_IfAnonymous()
    {
        languageService.Setup(r => r.FindByUserClaims()).Returns(TestLanguageInfo.Get(routeValue: "en"));
        currentUserAccessor.Object.User.SetOrRemoveClaim(PosApiClaimTypes.WorkflowTypeId, "666");

        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act

        userValues.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "lang", (TrimmedRequiredString)"en" },
            { "returning", false },
            { "isAuthenticated", false },
            { "isAnonymous", false },
            { "workflowType", 666 },
            { "userTimezoneUtcOffset", 300 },
            { "xsrfToken", "xxx" },
            { "visitCount", 666 },
            { "visitAfterDays", 0 },
        });

        posApiCrmService.VerifyWithAnyArgs(s => s.GetValueSegmentAsync(default, default), Times.Never);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetBasicLoyaltyProfileAsync(default, default), Times.Never);
    }

    [Theory]
    [InlineData(AuthState.Authenticated)]
    [InlineData(AuthState.Workflow)]
    public async Task ValueSegment_ShouldBePopulated_IfAuthenticated(AuthState authState)
    {
        SetupIdentity(authState);

        var testDate = new UtcDateTime(2017, 12, 12, 7, 8, 9);

        dateTimeCultureBasedFormatter.Setup(x => x.Format(It.IsAny<DateTime>(), It.IsAny<string>())).Returns("12/12/2017 12:08");
        posApiAuthenticationService.Setup(s => s.GetLastSessionAsync(ct, It.IsAny<bool>())).ReturnsAsync(new LastSession(new LastSessionDetails(loginTime: testDate)));
        posApiAccountServiceMock.Setup(r => r.GetRegistrationDateAsync(ct)).ReturnsAsync(testDate);
        posApiCrmService.Setup(r => r.GetBasicLoyaltyProfileAsync(ct, Cached)).ReturnsAsync(new BasicLoyaltyProfile(category: "P46"));
        posApiCrmService.Setup(r => r.GetLoyaltyPointsAsync(ct)).ReturnsAsync(777.77m);
        posApiCrmService.Setup(r => r.GetValueSegmentAsync(ct, Cached)).ReturnsAsync(new ServiceClients.Services.Crm.ValueSegments.ValueSegment(
            churnRate: 0.323245,
            customerId: 11101984,
            ewvip: "fakewarning",
            futureValue: 0.3123131,
            lifeCycleStage: "fakestage",
            microSegmentId: 111019,
            potentialVip: 0.4353,
            segmentId: 22,
            tierCode: 1,
            playerPriority: "0"));

        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act

        userValues.Should().Contain("isAuthenticated", authState == AuthState.Authenticated)
            .And.Contain("isAnonymous", false)
            .And.Contain("isAnonymous", false)
            .And.Contain("isFirstLogin", false)
            .And.Contain("customerId", 11101984)
            .And.Contain("segmentId", 22)
            .And.Contain("lifeCycleStage", "fakestage")
            .And.Contain("eWarningVip", "fakewarning")
            .And.Contain("microSegmentId", 111019)
            .And.Contain("churnRate", 0.323245)
            .And.Contain("futureValue", 0.3123131)
            .And.Contain("potentialVip", 0.4353)
            .And.Contain("tierCode", 1)
            .And.Contain("playerPriority", "0")
            .And.Contain("lastLoginTime", testDate)
            .And.Contain("lastLoginTimeFormatted", "12/12/2017 12:08")
            .And.Contain("registrationDate", "12/12/2017 12:08")
            .And.Contain("daysRegistered", 2);

        if (authState == AuthState.Authenticated)
        {
            userValues.Should().Contain("loyalty", "P46").And.Contain("loyaltyPoints", 777);
        }
    }

    [Fact]
    public async Task ShouldHandleExceptions()
    {
        SetupIdentity(AuthState.Authenticated);

        posApiAuthenticationService.Setup(s => s.GetLastSessionAsync(ct, It.IsAny<bool>())).ThrowsAsync(new Exception("Last session error"));
        posApiAccountServiceMock.Setup(r => r.GetRegistrationDateAsync(ct)).ThrowsAsync(new Exception("Registration date error"));
        posApiCrmService.Setup(r => r.GetBasicLoyaltyProfileAsync(ct, Cached)).ThrowsAsync(new Exception("Loyalty error"));
        posApiCrmService.Setup(r => r.GetLoyaltyPointsAsync(ct)).ThrowsAsync(new Exception("Loyalty points error"));
        posApiCrmService.Setup(r => r.GetValueSegmentAsync(ct, Cached)).ThrowsAsync(new Exception("Value segment error"));

        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act

        userValues.Should().Contain("isAuthenticated", true)
            .And.Contain("loyalty", null)
            .And.Contain("loyaltyPoints", 0)
            .And.Contain("isFirstLogin", false)
            .And.Contain("registrationDate", null)
            .And.NotContainKeys(
                "customerId",
                "segmentId",
                "lifeCycleStage",
                "eWarningVip",
                "microSegmentId",
                "churnRate",
                "futureValue",
                "potentialVip",
                "tierCode",
                "lastLoginTime",
                "lastLoginTimeFormatted");

        log.Logged.Select(x => x.Exception?.Message).Should().BeEquivalentTo(
            "Last session error",
            "Registration date error",
            "Loyalty error",
            "Loyalty points error",
            "Value segment error");
    }

    [Fact]
    public async Task Lang_ShouldReturnDefaultIfNothingInUserClaims()
    {
        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act
        userValues?["lang"].Should().Be("de");
    }

    [Fact]
    public async Task WorkflowType_ShouldReturnDefaultIfNothingInUserClaims()
    {
        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act
        userValues.Should().Contain("workflowType", 0);
    }

    [Fact]
    public async Task WorkflowType_ShouldReturnFromCache()
    {
        loginService.Setup(o => o.GetPostLoginRedirectKeyFromCache()).Returns(DocumentUseCase.Kyc);
        loginService.Setup(o => o.GetPostLoginRedirect(DocumentUseCase.Kyc))
            .Returns(new PostLoginRedirect { Options = new PostLoginRedirectOptions { OverrideWorkflowType = 12 } });

        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act
        userValues.Should().Contain("workflowType", 12);
    }

    [Fact]
    public async Task Returning_ShouldBeTrueWhenLastVisitorCookieExists()
    {
        lastVisitorCookie.Setup(h => h.GetValue()).Returns("me");
        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act
        userValues?["returning"].Should().Be(true);
    }

    [Theory]
    [InlineData(AuthState.Authenticated)]
    [InlineData(AuthState.Workflow)]
    public async Task IsFirstLogin_ShouldNotBePopulated_IfFirstSession(AuthState authState)
    {
        SetupIdentity(authState);
        posApiAuthenticationService.Setup(s => s.GetLastSessionAsync(ct, It.IsAny<bool>())).ReturnsAsync(new LastSession());

        var userValues = await target.GetClientConfigAsync(ct) as Dictionary<string, object>; // Act

        userValues.Should().Contain("isFirstLogin", true)
            .And.NotContainKeys("lastLoginTime", "lastLoginTimeFormatted");
    }
}
