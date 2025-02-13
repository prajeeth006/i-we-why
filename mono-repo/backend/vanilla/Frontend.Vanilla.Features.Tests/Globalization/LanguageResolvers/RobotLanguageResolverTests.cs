using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class RobotLanguageResolverTests
{
    private IRobotLanguageResolver target;
    private Mock<IGlobalizationConfiguration> config;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<IDeviceAtlasService> deviceAtlasService;

    private LanguageInfo defaultLang;

    public RobotLanguageResolverTests()
    {
        config = new Mock<IGlobalizationConfiguration>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        deviceAtlasService = new Mock<IDeviceAtlasService>();

        target = new RobotLanguageResolver(config.Object, httpContextAccessor.Object, deviceAtlasService.Object);

        defaultLang = TestLanguageInfo.Get();

        config.SetupGet(r => r.DefaultLanguage).Returns(defaultLang);
    }

    public static IEnumerable<object[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(TestValues.Booleans);

    [Theory, MemberData(nameof(TestCases))]
    public void ShouldReturnDefaultLanguage_IfCertainConditions(bool isRootPath, bool isRobot)
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns(isRootPath ? "/" : "/page");
        deviceAtlasService.Setup(p => p.Get()).Returns((true, new Dictionary<string, string> { ["isRobot"] = isRobot ? "1" : "0" }));

        var lang = target.Resolve();

        lang.Should().BeSameAs(isRootPath && isRobot ? defaultLang : null);
    }
}
