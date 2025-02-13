using System.Collections.Generic;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class HiddenLanguagesResolverTests
{
    private IHiddenLanguagesResolver target;
    private Mock<IGlobalizationConfiguration> config;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<ILanguageByUserClaimsResolver> languageByUserClaimsResolver;

    public HiddenLanguagesResolverTests()
    {
        config = new Mock<IGlobalizationConfiguration>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        languageByUserClaimsResolver = new Mock<ILanguageByUserClaimsResolver>();
        target = new HiddenLanguagesResolver(config.Object, currentUserAccessor.Object, languageByUserClaimsResolver.Object);

        config.SetupGet(c => c.HiddenLanguages).Returns(new[] { TestLanguageInfo.Get(), TestLanguageInfo.Get() });
        currentUserAccessor.SetupGet(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity()));
    }

    [Fact]
    public void ShouldExcludeUsersLanguage_IfAuthenticated()
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity("authenticated")));
        languageByUserClaimsResolver.Setup(r => r.Resolve()).Returns(config.Object.HiddenLanguages[0]);

        // Act
        var result = target.Resolve();

        currentUserAccessor.VerifyGet(a => a.User, Times.Never); // Not called yet -> should be lazy
        var expect = new List<LanguageInfo> { config.Object.HiddenLanguages[1] };
        result.Should().BeEquivalentTo(expect);
    }

    [Fact]
    public void ShouldReturnEmpty_IfNoHiddenLanguages()
    {
        config.SetupGet(c => c.HiddenLanguages).ReturnsEmpty();

        // Act
        var result = target.Resolve();

        result.Should().BeEmpty();
        currentUserAccessor.VerifyGet(a => a.User, Times.Never);
        languageByUserClaimsResolver.Verify(r => r.Resolve(), Times.Never);
    }

    [Theory, BooleanData]
    public void ShouldReturnAll_IfNullOrUnauthenticatedUserOrNoClaimsLanguage(bool authenticated)
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(authenticated ? "auth" : null)));

        // Act
        var result = target.Resolve();

        result.Should().BeEquivalentTo(config.Object.HiddenLanguages);
        languageByUserClaimsResolver.Verify(r => r.Resolve(), Times.Exactly(authenticated ? 1 : 0));
    }
}
