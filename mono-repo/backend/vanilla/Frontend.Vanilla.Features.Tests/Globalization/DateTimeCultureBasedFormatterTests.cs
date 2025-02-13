using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization;

public class DateTimeCultureBasedFormatterTests
{
    private readonly Mock<ILanguageService> languageService;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly DateTimeCultureBasedFormatter formatter;
    private readonly DateTime testDate = new DateTime(2021, 11, 21);

    public DateTimeCultureBasedFormatterTests()
    {
        languageService = new Mock<ILanguageService>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        formatter = new DateTimeCultureBasedFormatter(languageService.Object, currentUserAccessor.Object);

        CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = new CultureInfo("en-US");
        currentUserAccessor.SetupGet(x => x.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new List<Claim> { })));
    }

    [Fact]
    public void Format_ShouldReturnInCurrentCultureFormat()
    {
        // Act
        var result = formatter.Format(testDate);
        result.Should().ContainAll("11/21/2021 12:00", "AM");
    }

    [Fact]
    public void Format_ShouldReturnInUserCultureFormat()
    {
        currentUserAccessor.SetupGet(x => x.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new List<Claim> { new Claim(PosApiClaimTypes.CultureName, "de-DE") })));
        // Act
        var result = formatter.Format(testDate);
        result.Should().Be("21.11.2021 00:00");
    }

    [Fact]
    public void Format_ShouldReturnInBrowserCultureFormat()
    {
        languageService.SetupGet(x => x.UseBrowserLanguage).Returns(true);
        languageService.SetupGet(x => x.BrowserPreferredCulture).Returns("es-ES");

        // Act
        var result = formatter.Format(testDate);
        result.Should().Be("21/11/2021 0:00");
    }

    [Fact]
    public void Format_ShouldReturnInBrowserCultureFormatWithCustomFormat()
    {
        languageService.SetupGet(x => x.UseBrowserLanguage).Returns(true);
        languageService.SetupGet(x => x.BrowserPreferredCulture).Returns("es-ES");

        // Act
        var result = formatter.Format(testDate, "d");
        result.Should().Be("21/11/2021");
    }
}
