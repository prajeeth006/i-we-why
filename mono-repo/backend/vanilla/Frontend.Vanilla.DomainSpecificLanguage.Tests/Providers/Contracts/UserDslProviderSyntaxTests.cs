using System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class UserDslProviderSyntaxTests : SyntaxTestBase<IUserDslProvider>
{
    [Theory, BooleanData]
    public void FirstLoginTest(bool value)
    {
        Provider.Setup(p => p.GetFirstLoginAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("User.FirstLogin", value);
    }

    [Theory, BooleanData]
    public void IsAnonymousTest(bool value)
    {
        Provider.Setup(p => p.IsAnonymous()).Returns(value);
        EvaluateAndExpect("User.IsAnonymous", value);
    }

    [Obsolete("Instead check that trackerId is not empty.")]
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void HasTrackerTest(bool value)
    {
        Provider.Setup(p => p.HasTracker()).Returns(value);
        EvaluateAndExpect("User.HasTracker", value);
    }

    [Fact]
    public void TrackerIdTest()
    {
        Provider.Setup(p => p.GetTrackerId()).Returns("123");
        EvaluateAndExpect("User.TrackerId", "123");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void LoggedInTest(bool value)
    {
        Provider.Setup(p => p.LoggedIn()).Returns(value);
        EvaluateAndExpect("User.LoggedIn", value);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void IsKnownTest(bool value)
    {
        Provider.Setup(p => p.IsKnown()).Returns(value);
        EvaluateAndExpect("User.IsKnown", value);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void IsRealPlayerTest(bool value)
    {
        Provider.Setup(p => p.IsRealPlayer()).Returns(value);
        EvaluateAndExpect("User.IsRealPlayer", value);
    }

    [Fact]
    public void LoyaltyStatusTest()
    {
        Provider.Setup(p => p.GetLoyaltyStatusAsync(Mode)).ReturnsAsync("VIP");
        EvaluateAndExpect("User.LoyaltyStatus", "VIP");
    }

    [Fact]
    public void LoyaltyPointsTest()
    {
        Provider.Setup(p => p.GetLoyaltyPointsAsync(Mode)).ReturnsAsync(666m);
        EvaluateAndExpect("User.LoyaltyPoints", 666m);
    }

    [Fact]
    public void CountryTest()
    {
        Provider.Setup(p => p.GetCountry()).Returns("Austria");
        EvaluateAndExpect("User.Country", "Austria");
    }

    [Obsolete]
    [Fact]
    public void LanguageTest()
    {
        Provider.Setup(p => p.GetLanguage()).Returns("sw");
        EvaluateAndExpect("User.Language", "sw");
    }

    [Obsolete]
    [Fact]
    public void CultureTest()
    {
        Provider.Setup(p => p.GetCulture()).Returns("sw-KE");
        EvaluateAndExpect("User.Culture", "sw-KE");
    }

    [Fact]
    public void LoginNameTest()
    {
        Provider.Setup(p => p.GetLoginName()).Returns("chuck.norris");
        EvaluateAndExpect("User.LoginName", "chuck.norris");
    }

    [Fact]
    public void VisitCountTest()
    {
        Provider.Setup(p => p.GetVisitCount()).Returns(222m);
        EvaluateAndExpect("User.VisitCount", 222m);
    }

    [Fact]
    public void VisitAfterDaysTest()
    {
        Provider.Setup(p => p.GetVisitAfterDays()).Returns(333m);
        EvaluateAndExpect("User.VisitAfterDays", 333m);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void IsInGroupTest(bool isInGroup)
    {
        Provider.Setup(p => p.IsInGroupAsync(Mode, "vip")).ReturnsAsync(isInGroup);
        EvaluateAndExpect("User.IsInGroup('vip')", isInGroup);
    }

    [Obsolete]
    [Fact]
    public void RegistrationDateTest()
    {
        Provider.Setup(p => p.GetRegistrationDateAsync(Mode)).ReturnsAsync("2000-01-02");
        EvaluateAndExpect("User.RegistrationDate", "2000-01-02");
    }

    [Obsolete]
    [Fact]
    public void DaysRegisteredTest()
    {
        Provider.Setup(p => p.GetDaysRegisteredAsync(Mode)).ReturnsAsync(666m);
        EvaluateAndExpect("User.DaysRegistered", 666m);
    }

    [Fact]
    public void TierCodeTest()
    {
        Provider.Setup(p => p.GetTierCodeAsync(Mode)).ReturnsAsync(2m);
        EvaluateAndExpect("User.TierCode", 2m);
    }

    [Fact]
    public void TrackerTest()
    {
        Provider.Setup(p => p.GetAffiliateInfo()).Returns("4418546");
        EvaluateAndExpect("User.AffiliateInfo", "4418546");
    }

    [Fact]
    public void GetGroupAttributeTest()
    {
        Provider.Setup(p => p.GetGroupAttributeAsync(Mode, "usergroup", "attr")).ReturnsAsync("attrvalue");
        EvaluateAndExpect("User.GetGroupAttribute('usergroup','attr')", "attrvalue");
    }

    [Fact]
    public void LastLoginTimeFormattedTest()
    {
        Provider.Setup(p => p.GetLastLoginTimeFormattedAsync(Mode)).ReturnsAsync("1/2/2019 5:32 AM");
        EvaluateAndExpect("User.LastLoginTimeFormatted", "1/2/2019 5:32 AM");
    }

    [Fact]
    public void AgeTest()
    {
        Provider.Setup(p => p.GetAge()).Returns(34);
        EvaluateAndExpect("User.Age", 34M);
    }
}
