using System.Linq;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class LanguageByUserClaimsResolverTests
{
    private ILanguageByUserClaimsResolver target;
    private IGlobalizationConfiguration config;
    private ICurrentUserAccessor currentUserAccessor;
    private TestLogger<LanguageByUserClaimsResolver> log;

    public LanguageByUserClaimsResolverTests()
    {
        config = Mock.Of<IGlobalizationConfiguration>();
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>();
        log = new TestLogger<LanguageByUserClaimsResolver>();
        target = new LanguageByUserClaimsResolver(config, currentUserAccessor, log);

        Mock.Get(config).SetupGet(c => c.AllowedLanguages).Returns(new[]
        {
            TestLanguageInfo.Get("en-US"),
            TestLanguageInfo.Get("sw-KE"),
        });
        currentUserAccessor.User = new ClaimsPrincipal();
        currentUserAccessor.User.AddClaim(ClaimTypes.Name, "Chuck Norris");
    }

    [Fact]
    public void ShouldGetFromCultureOrLanguageClaim()
    {
        currentUserAccessor.User.AddClaim(PosApiClaimTypes.CultureName, "sw-KE");

        // Act
        var result = target.Resolve();

        result.Should().BeSameAs(config.AllowedLanguages[1]);
        log.VerifyNothingLogged();
    }

    [Theory, ValuesData(null, "omg")]
    public void ShouldLog_IfInvalidCulture(string invalidValue)
    {
        currentUserAccessor.User.SetOrRemoveClaim(PosApiClaimTypes.CultureName, invalidValue);

        // Act
        var result = target.Resolve();

        result.Should().BeNull();
        log.Logged.Single().Verify(
            LogLevel.Error,
            ("claimType", PosApiClaimTypes.CultureName),
            ("user", "Chuck Norris"),
            ("culture", invalidValue),
            ("featureName", GlobalizationConfiguration.FeatureName),
            ("allowedLanguages", "en-US, sw-KE"));
    }
}
