using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ReCaptcha;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class ReCaptchaConfigurationFactoryTests
{
    private SimpleConfigurationFactory<IReCaptchaConfiguration, ReCaptchaConfigurationDto> target;
    private Mock<IEnvironmentProvider> envProvider;
    private ReCaptchaConfigurationDto dto;

    public ReCaptchaConfigurationFactoryTests()
    {
        envProvider = new Mock<IEnvironmentProvider>();
        dto = new ReCaptchaConfigurationDto
        {
            Areas = new Dictionary<string, ReCaptchaEnablement>
            {
                ["Login"] = ReCaptchaEnablement.EnableOnFailureCount,
            },
            Thresholds = new Dictionary<string, double>
            {
                ["Login"] = 0.5,
            },
            EnterpriseSecretKey = "Secret enterprise",
            EnterpriseSiteKey = "Site enterprise",
            EnterpriseProjectId = "project-id",
            Theme = "Light",
            InstrumentationOnPageLoad = true,
            IsSuccessLogEnabled = true,
            FailureCount = 5,
            FailureCountExpiration = TimeSpan.FromSeconds(666),
            LogAdditionalData = true,
            BypassTechnicalError = true,
        };
        target = new ReCaptchaConfigurationFactory(envProvider.Object);
    }

    [Theory]
    [InlineData(null, null)]
    [InlineData("Light", "light")]
    public void Theme_ShouldBeLowerCase(string input, string expected)
    {
        dto.Theme = input;

        var config = target.Create(dto);

        config.Theme.Should().Be(expected);
    }

    [Fact]
    public void Areas_ShouldBeCaseInsensitive()
    {
        var config = target.Create(dto);

        config.Areas["loGIN"].Should().Be(ReCaptchaEnablement.EnableOnFailureCount);
    }

    [Fact]
    public void Thresholds_ShouldBeCaseInsensitive()
    {
        var config = target.Create(dto);

        config.Thresholds["loGIN"].Should().Be(0.5);
    }

    [Fact]
    public void Areas_ShouldNotAllowUndefinedEnumValues()
    {
        dto.Areas = new Dictionary<string, ReCaptchaEnablement>
        {
            ["Login"] = (ReCaptchaEnablement)666,
        };

        RunAndExceptErrors((nameof(dto.Areas), $"{nameof(dto.Areas)}['Login']='666' is invalid. Supported values: {Enum<ReCaptchaEnablement>.Values.Join()}."));
    }

    [Theory]
    [InlineData(1.5)]
    [InlineData(-1)]
    public void Thresholds_ShouldValidateRange(double value)
    {
        dto.Thresholds = new Dictionary<string, double>
        {
            ["xx"] = value,
        };

        RunAndExceptErrors((nameof(dto.Thresholds), $"{nameof(dto.Thresholds)}['xx']='{value}' is invalid. Only numbers from 0 to 1 are supported."));
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(true, true)]
    public void InstrumentationOnPageLoad_ReturnBoolean(bool input, bool expected)
    {
        dto.InstrumentationOnPageLoad = input;

        var config = target.Create(dto);

        config.InstrumentationOnPageLoad.Should().Be(expected);
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(true, true)]
    public void IsSuccessLogEnabled_ReturnBoolean(bool input, bool expected)
    {
        dto.IsSuccessLogEnabled = input;

        var config = target.Create(dto);

        config.IsSuccessLogEnabled.Should().Be(expected);
    }

    [Fact]
    public void EnterpriseProjectId_ShouldReturnString()
    {
        dto.EnterpriseProjectId = "ProjectId";

        var config = target.Create(dto);

        config.EnterpriseProjectId.Should().Be("ProjectId");
    }

    [Theory]
    [InlineData("site", null)]
    [InlineData(null, "secret")]
    public void EnabledVersions_Enterprise_ShouldValidateKeys(string siteKey, string secretKey)
    {
        dto.EnterpriseSiteKey = siteKey;
        dto.EnterpriseSecretKey = secretKey;

        if (siteKey == null)
        {
            RunAndExpectRequiredKeyError(nameof(dto.EnterpriseSiteKey));
        }

        if (secretKey == null)
        {
            RunAndExpectRequiredKeyError(nameof(dto.EnterpriseSecretKey));
        }
    }

    private void RunAndExpectRequiredKeyError(string property)
    {
        RunAndExceptErrors((property, $"RecaptchaEnterprise key {property} is required."));
    }

    private void RunAndExceptErrors((string property, string error) error)
    {
        var ex = Assert.Throws<InvalidConfigurationException>(() => target.Create(dto)); // Act

        ex.Errors.Select(e => (e.MemberNames.First(), e.ErrorMessage)).First().Should().BeEquivalentTo(error);
    }
}
