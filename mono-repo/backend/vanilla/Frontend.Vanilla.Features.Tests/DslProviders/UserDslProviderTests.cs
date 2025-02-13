using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class UserDslProviderTests
{
    private readonly IUserDslProvider target;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<ILastVisitorCookie> lastVisitorCookie;
    private readonly IVisitorSettingsManager settingsManager;
    private readonly Mock<IPosApiAccountServiceInternal> posApiAccountService;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private readonly Mock<IPosApiAuthenticationServiceInternal> posApiAuthenticationService;
    private readonly Mock<ICookieJsonHandler> cookieJsonHandler;
    private readonly Mock<ITrackerIdResolver> trackerIdResolver;
    private readonly Mock<IDateTimeCultureBasedFormatter> dateTimeCultureBasedFormatter;
    private readonly TestClock clock;

    private ClaimsPrincipal user;
    private readonly ExecutionMode mode;

    public UserDslProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        lastVisitorCookie = new Mock<ILastVisitorCookie>();
        settingsManager = Mock.Of<IVisitorSettingsManager>();
        posApiAccountService = new Mock<IPosApiAccountServiceInternal>();
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        posApiAuthenticationService = new Mock<IPosApiAuthenticationServiceInternal>();
        cookieJsonHandler = new Mock<ICookieJsonHandler>();
        trackerIdResolver = new Mock<ITrackerIdResolver>();
        dateTimeCultureBasedFormatter = new Mock<IDateTimeCultureBasedFormatter>();
        clock = new TestClock { UtcNow = new UtcDateTime(2021, 7, 8, 14, 5, 6) };
        target = new UserDslProvider(
            currentUserAccessor.Object,
            lastVisitorCookie.Object,
            settingsManager,
            posApiAccountService.Object,
            posApiCrmService.Object,
            posApiAuthenticationService.Object,
            cookieJsonHandler.Object,
            trackerIdResolver.Object,
            clock,
            dateTimeCultureBasedFormatter.Object);

        user = TestUser.Get();
        mode = TestExecutionMode.Get();

        currentUserAccessor.SetupGet(c => c.User).Returns(() => user);
    }

    public static IEnumerable<object[]> TestCases
        => TestValues.Booleans.ToTestCases()
            .CombineWith(TestUser.AuthenticatedOrWorkflow);

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetFirstLoginAsync_ShouldGetLastSession(
        bool firstLogin,
        AuthState authState)
    {
        user = TestUser.Get(authState);
        posApiAuthenticationService.Setup(cs => cs.GetLastSessionAsync(mode, It.IsAny<bool>())).ReturnsAsync(new LastSession(firstLogin ? null : new LastSessionDetails()));

        var result = await target.GetFirstLoginAsync(mode); // Act

        result.Should().Be(firstLogin);
    }

    [Theory, BooleanData]
    public void IsKnown_DependsOnLastVisitorCookie(bool isKnown)
    {
        lastVisitorCookie.Setup(o => o.GetValue()).Returns(isKnown ? "username".AsTrimmedRequired() : null);
        target.IsKnown().Should().Be(isKnown);
    }

    [Theory]
    [InlineData(AuthState.Anonymous, false)]
    [InlineData(AuthState.Workflow, false)]
    [InlineData(AuthState.Authenticated, true)]
    public void LoggedIn_ShouldGetFromUserIdentity(AuthState authState, bool expected)
    {
        user = TestUser.Get(authState);
        target.LoggedIn().Should().Be(expected);
    }

    [Fact]
    public void LoginName_ShouldBeEmptyIfNoClaim()
        => target.GetLoginName().Should().BeNull();

    [Fact]
    public void LoginName_ShouldBeCalculatedFromClaim()
    {
        user.SetOrRemoveClaim(PosApiClaimTypes.Name, "John");
        target.GetLoginName().Should().Be("John");
    }

    [Theory]
    [InlineData("ANO", "anonymous", true)]
    [InlineData("ANO", "shop", false)]
    public void IsAnonymous_ShouldBeCalculatedFromClaim(string jurisdictionId, string accBusinessPhase, bool result)
    {
        user.SetOrRemoveClaim(PosApiClaimTypes.JurisdictionId, jurisdictionId);
        user.SetOrRemoveClaim(PosApiClaimTypes.AccBusinessPhase, accBusinessPhase);
        target.IsAnonymous().Should().Be(result);
    }

    [Fact]
    public void Country_ShouldBeEmptyIfNoClaim()
        => target.GetCountry().Should().BeNull();

    [Fact]
    public void Country_ShouldCalculateFromClaim()
    {
        user.SetOrRemoveClaim(ClaimTypes.Country, "Austria");
        target.GetCountry().Should().Be("Austria");
    }

    [Obsolete]
    [Fact]
    public void Language_ShouldBeEmptyIfNoClaim()
        => target.GetLanguage().Should().BeNull();

    [Obsolete]
    [Fact]
    public void Language_ShouldCalculateFromClaim()
    {
        user.SetOrRemoveClaim(PosApiClaimTypes.LanguageCode, "Swahili");
        target.GetLanguage().Should().Be("Swahili");
    }

    [Obsolete]
    [Fact]
    public void Culture_ShouldCalculate()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("zh-TW"));
        target.GetCulture().Should().Be("zh-TW");
    }

    [Theory]
    [InlineData(true, "True")]
    [InlineData(false, "False")]
    public void IsRealPlayer_ShouldCalculate(bool expectedValue, string claimValue)
    {
        user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(PosApiClaimTypes.IsRealMoneyPlayer, claimValue) }, "authenticated"));
        target.IsRealPlayer().Should().Be(expectedValue);
    }

    [Fact]
    public void IsRealPlayer_ShouldBeFalse_IfNoClaim()
        => target.IsRealPlayer().Should().BeFalse();

    [Obsolete("Instead check that trackerId is not empty.")]
    [Theory]
    [InlineData(null, false)]
    [InlineData("abc", true)]
    public void HasTracker_Test(string trackerId, bool expected)
    {
        trackerIdResolver.Setup(r => r.Resolve(true)).Returns(trackerId != null ? new TrimmedRequiredString(trackerId) : null);
        target.HasTracker().Should().Be(expected);
    }

    [Fact]
    public void GetTrackerId_ShouldDelegateToResolver()
    {
        trackerIdResolver.Setup(r => r.Resolve(true)).Returns("123");
        target.GetTrackerId().Should().Be("123"); // Act
    }

    [Theory]
    [InlineData("1986-03-23", 35)]
    [InlineData("1986-09-23", 34)]
    [InlineData("1986-07-08", 35)]
    public void GetAge_ShouldReturnValue(string dateOfBirth, decimal expect)
    {
        user = TestUser.Get(AuthState.Authenticated);
        user.SetOrRemoveClaim(PosApiClaimTypes.Birth.Date, dateOfBirth);
        target.GetAge().Should().Be(expect); // Act
    }

    [Fact]
    public void GetAge_ShouldReturnDefaultValueForUnauthenticated()
    {
        user.SetOrRemoveClaim(PosApiClaimTypes.Birth.Date, "2021-01-02");
        target.GetAge().Should().Be(-1); // Act
    }

    [Fact]
    public async Task GetLoyaltyStatusAsync_ShouldGetFromPosApiService_IfAuthenticated()
    {
        user = TestUser.Get(AuthState.Authenticated);
        posApiCrmService.Setup(s => s.GetBasicLoyaltyProfileAsync(mode, true)).ReturnsAsync(new BasicLoyaltyProfile(category: "Gold"));

        var result = await target.GetLoyaltyStatusAsync(mode); // Act

        result.Should().Be("Gold");
    }

    [Theory, MemberData(nameof(AnonymousOrWorkflowCases))]
    public async Task GetLoyaltyStatusAsync_ShouldReturnNull_IfAnonymousOrWorkflow(AuthState authState)
    {
        user = TestUser.Get(authState);

        var result = await target.GetLoyaltyStatusAsync(mode); // Act

        result.Should().BeNull();
        posApiCrmService.VerifyWithAnyArgs(s => s.GetBasicLoyaltyProfileAsync(default(ExecutionMode), default), Times.Never);
    }

    [Fact]
    public async Task GetLoyaltyPointsAsync_ShouldGetFromPosApiService_IfAuthenticated()
    {
        user = TestUser.Get(AuthState.Authenticated);
        posApiCrmService.Setup(r => r.GetLoyaltyPointsAsync(mode)).ReturnsAsync(666.12M);

        var result = await target.GetLoyaltyPointsAsync(mode); // Act

        result.Should().Be(666.12M);
    }

    [Theory, MemberData(nameof(AnonymousOrWorkflowCases))]
    public async Task GetLoyaltyPointsAsync_ShouldReturnFallback_IfAnonymousOrWorkflow(AuthState authState)
    {
        user = TestUser.Get(authState);

        var result = await target.GetLoyaltyPointsAsync(mode); // Act

        result.Should().Be(-1);
        posApiCrmService.Verify(r => r.GetLoyaltyPointsAsync(default(ExecutionMode)), Times.Never);
    }

    [Theory, ValuesData(-10, 0, 666)]
    public void VisitCount_ShouldCalculate(int visitCount)
    {
        settingsManager.Current = new VisitorSettings().With(visitCount: visitCount);
        target.GetVisitCount().Should().Be(visitCount);
    }

    [Theory, MemberData(nameof(AuthenticatedOrWorkflowCases))]
    public async Task GetTierCodeAsync_ShouldGetValueFromService(AuthState authState)
    {
        user = TestUser.Get(authState);
        posApiCrmService.Setup(s => s.GetValueSegmentAsync(mode, true)).ReturnsAsync(new ServiceClients.Services.Crm.ValueSegments.ValueSegment(tierCode: 2));

        var result = await target.GetTierCodeAsync(mode); // Act

        result.Should().Be(2);
    }

    [Fact]
    public async Task GetTierCodeAsync_ShouldReturnDefault_IfAnonymous()
    {
        var result = await target.GetTierCodeAsync(mode); // Act

        result.Should().Be(-1);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetValueSegmentAsync(default(ExecutionMode), default), Times.Never);
    }

    public static IEnumerable<object[]> AnonymousOrWorkflowCases => TestUser.AnonymousOrWorkflow.ToTestCases();
    public static IEnumerable<object[]> AuthenticatedOrWorkflowCases => TestUser.AuthenticatedOrWorkflow.ToTestCases();

    [Theory, MemberData(nameof(AuthenticatedOrWorkflowCases))]
    public void GetAffiliateInfo_ShouldGetValueFromService(AuthState authState)
    {
        user = TestUser.Get(authState);
        cookieJsonHandler.Setup(c => c.GetValue("mobileLogin.PostLoginValues", "webmasterId")).Returns("12069");
        target.GetAffiliateInfo().Should().Be("12069"); // Act
    }

    [Fact]
    public void GetAffiliateInfo_ShouldReturnDefault_IfAnonymous()
    {
        target.GetAffiliateInfo().Should().BeNull(); // Act
        cookieJsonHandler.Verify(s => s.GetValue(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Theory, MemberData(nameof(AuthenticatedOrWorkflowCases))]
    public void GetTracker_ShouldReturnNull_IfKeyIsNotFound(AuthState authState)
    {
        user = TestUser.Get(authState);
        cookieJsonHandler.Setup(c => c.GetValue("mobileLogin.PostLoginValues", "webmasterId")).Returns((string)null);
        target.GetAffiliateInfo().Should().BeNull(); // Act
    }

    public static readonly IEnumerable<object[]> VisitAfterDaysTestData = new[]
    {
        new object[] { -1, default(UtcDateTime), default(UtcDateTime) },
        [-1, default(UtcDateTime), new UtcDateTime(2000, 1, 1)],
        [-1, new UtcDateTime(2000, 1, 1), default(UtcDateTime)],
        [-1, new UtcDateTime(2000, 1, 21), new UtcDateTime(2000, 1, 1)],
        [20, new UtcDateTime(2000, 1, 1), new UtcDateTime(2000, 1, 21)],
        [20, new UtcDateTime(2000, 1, 1), new UtcDateTime(2000, 1, 21, 23, 59, 59)],
        [66, new UtcDateTime(2000, 1, 1), new UtcDateTime(2000, 3, 7)],
    };

    [Theory, MemberData(nameof(VisitAfterDaysTestData))]
    public void VisitAfterDays_ShouldCalculate(int expectedVisitAfterDays, UtcDateTime previousSessionStartTime, UtcDateTime sessionStartTime)
    {
        settingsManager.Current = new VisitorSettings().With(previousSessionStartTime: previousSessionStartTime, sessionStartTime: sessionStartTime);
        target.GetVisitAfterDays().Should().Be(expectedVisitAfterDays);
    }

    private static readonly IEnumerable<object[]> IsInGroupTestCases = new[]
    {
        new object[] { null, false },
        ["  ", false],
        ["vip", false],
        ["X-Men", false],
        ["VIP", true],
        ["Expendables", true],
    };

    public static readonly IEnumerable<object[]> GroupTestCases = IsInGroupTestCases.CombineWith(TestUser.AuthenticatedOrWorkflow);

    [Theory, MemberData(nameof(GroupTestCases))]
    public async Task IsInGroupAsync_ShouldCheckIfGroupIsContained(string groupName, bool expected, int authState)
    {
        user = TestUser.Get((AuthState)authState);
        posApiAccountService.Setup(s => s.GetSegmentationGroupsAsync(mode)).ReturnsAsync(new[] { "VIP", "Expendables" });

        var result = await target.IsInGroupAsync(mode, groupName); // Act

        result.Should().Be(expected);
    }

    [Theory, MemberData(nameof(AuthenticatedOrWorkflowCases))]
    public async Task GetGroupAttributeAsync_ShouldReturnAttribute(AuthState authState)
    {
        user = TestUser.Get(authState);
        posApiCrmService.Setup(s => s.GetCampaignsAsync(mode)).ReturnsAsync(new[]
        {
            new CampaignData(action: "usergroup", rewardAttributes: new Dictionary<string, string> { { "attr1", "value1" } }),
        });

        var result = await target.GetGroupAttributeAsync(mode, "usergroup", "attr1"); // Act

        result.Should().Be("value1");
    }

    [Fact]
    public async Task GetGroupAttributeAsync_ShouldReturnNull_ForAnonymousUser()
    {
        var result = await target.GetGroupAttributeAsync(mode, "usergroup", "attr1"); // Act

        result.Should().Be(null);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetCampaignsAsync(default), Times.Never);
    }

    [Theory]
    [InlineData("nonexistentgroup", "attr1")]
    [InlineData("usergroup", "nonexistentattribute")]
    [InlineData("  ", "attr1")]
    [InlineData(null, "attr1")]
    [InlineData("usergroup", "  ")]
    [InlineData("usergroup", null)]
    public async Task GetGroupAttributeAsync_ShouldReturnNull_ForInvalidOrNonexistentInputParams(string group, string attribute)
    {
        user = TestUser.Get(AuthState.Authenticated);
        posApiCrmService.Setup(s => s.GetCampaignsAsync(mode)).ReturnsAsync(new[]
        {
            new CampaignData(action: "usergroup", rewardAttributes: new Dictionary<string, string> { { "attr1", "value1" } }),
        });

        var result = await target.GetGroupAttributeAsync(mode, group, attribute); // Act

        result.Should().Be(null);
    }

    [Obsolete]
    [Fact]
    public async Task GetRegistrationDateAsync_ShouldReturnEmptyIfUserUnauthenticated()
    {
        var result = await target.GetRegistrationDateAsync(mode); // Act

        result.Should().BeEmpty();
        posApiAccountService.Verify(s => s.GetRegistrationDateAsync(default(ExecutionMode)), Times.Never);
    }

    [Obsolete]
    [Theory, MemberData(nameof(AuthenticatedOrWorkflowCases))]
    public async Task GetRegistrationDateAsync_ShouldGetFromAccountInfo(AuthState authState)
    {
        user = TestUser.Get(authState);
        posApiAccountService.Setup(x => x.GetRegistrationDateAsync(mode)).ReturnsAsync(
            new UtcDateTime(1984, 10, 11, 11, 22, 53));

        var result = await target.GetRegistrationDateAsync(mode); // Act

        result.Should().Contain("1984-10-11");
    }

    [Obsolete]
    [Fact]
    public async Task GetDaysRegisteredAsync_ShouldReturnNegativeIfUserUnauthenticated()
    {
        var result = await target.GetDaysRegisteredAsync(mode); // Act

        result.Should().Be(-1);
        posApiAccountService.Verify(s => s.GetRegistrationDateAsync(default(ExecutionMode)), Times.Never);
    }

    private static readonly IEnumerable<object[]> DaysRegisteredTestCases = new[]
    {
        new object[] { "2017-12-24 23:00:00", 0 },
        ["2017-12-24 23:59:59", 0],
        ["2017-12-25 00:00:00", 1],
        ["2017-12-26 10:00:00", 2],
        ["2018-02-26 10:00:00", 64],
    };

    public static readonly IEnumerable<object[]> DaysTestCases = DaysRegisteredTestCases.CombineWith(TestUser.AuthenticatedOrWorkflow);

    [Obsolete]
    [Theory, MemberData(nameof(DaysTestCases))]
    public async Task GetDaysRegisteredAsync_ShouldGetFromAccountInfoAndCalculate(string now, int expected, AuthState authState)
    {
        var registrationDate = new DateTime(2017, 12, 24, 23, 0, 0);
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Ekaterinburg Standard Time");
        user = TestUser.Get(authState);
        posApiAccountService.Setup(x => x.GetRegistrationDateAsync(mode)).ReturnsAsync(
            new UtcDateTime(TimeZoneInfo.ConvertTimeToUtc(registrationDate, timeZone)));
        clock.UtcNow = new UtcDateTime(TimeZoneInfo.ConvertTimeToUtc(DateTime.Parse(now), timeZone));

        var result = await target.GetDaysRegisteredAsync(mode); // Act

        result.Should().Be(expected);
    }

    public static readonly IEnumerable<object[]> LastLoginTimeTestCases = new[]
    {
        new object[] { false, AuthState.Anonymous, new UtcDateTime(2019, 5, 29, 23), string.Empty },
        [true, AuthState.Anonymous, new UtcDateTime(2019, 5, 29, 23), string.Empty],
        [true, AuthState.Authenticated, new UtcDateTime(2019, 5, 29, 23), "5/30/2019 4:00 AM"],
        [true, AuthState.Authenticated, new UtcDateTime(2019, 5, 28, 12, 21), "5/28/2019 5:21 PM"],
        [true, AuthState.Authenticated, new UtcDateTime(2019, 5, 27, 2, 21), "5/27/2019 7:21 AM"],
        [true, AuthState.Authenticated, new UtcDateTime(2019, 5, 28, 11, 21), "5/28/2019 4:21 PM"],
    };

    [Theory, MemberData(nameof(LastLoginTimeTestCases))]
    public async Task GetLastLoginTimeFormattedAsync_ShouldGetLastSession(bool isLastSessionDetails, AuthState authState, UtcDateTime date, string expected)
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("en-US", false));
        user = TestUser.Get(authState);
        posApiAuthenticationService.Setup(cs => cs.GetLastSessionAsync(mode, It.IsAny<bool>())).ReturnsAsync(isLastSessionDetails ? new LastSession(new LastSessionDetails(date)) : null);
        dateTimeCultureBasedFormatter.Setup(x => x.Format(It.IsAny<DateTime>(), It.IsAny<string>())).Returns(expected);
        var result = await target.GetLastLoginTimeFormattedAsync(mode); // Act

        result.Should().Be(expected);
    }
}
