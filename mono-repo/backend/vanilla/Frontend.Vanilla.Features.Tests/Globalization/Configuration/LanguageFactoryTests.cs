using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Configuration;

public sealed class LanguageFactoryTests
{
    private ILanguageFactory target;
    private Mock<ICultureOverridesMerger> cultureOverridesMerger;
    private Mock<ICultureSerializer> cultureSerializer;

    private string cultureName;
    private Dictionary<string, LanguageInfoDto> cultureMapping;

    public LanguageFactoryTests()
    {
        cultureOverridesMerger = new Mock<ICultureOverridesMerger>();
        cultureSerializer = new Mock<ICultureSerializer>();
        target = new LanguageFactory(cultureOverridesMerger.Object, cultureSerializer.Object);

        cultureName = "sw-KE";
        cultureMapping = new Dictionary<string, LanguageInfoDto>
        {
            [cultureName] = new LanguageInfoDto
            {
                NativeName = "sw name",
                RouteValue = "rv-sw",
                SitecoreContentLanguage = "sc-sw",
                HtmlLangAttribute = "html-sw",
                AngularLocale = "ng-sw",
            },
        };
    }

    [Fact]
    public void ShouldCreateLanguageCorrectly()
    {
        var cultureOverrides = new Dictionary<string, JObject>();
        var mergedOverride = new JObject();
        cultureOverridesMerger.Setup(m => m.MergeOverridesChain(new CultureInfo(cultureName), cultureOverrides)).Returns(mergedOverride);

        // Act
        var lang = target.Create(cultureName, "TestProp", cultureMapping, cultureOverrides);

        lang.Culture.Name.Should().Be(cultureName);
        lang.Culture.UseUserOverride.Should().BeFalse();
        lang.NativeName.Should().Be("sw name");
        lang.RouteValue.Should().Be("rv-sw");
        lang.SitecoreContentLanguage.Should().Be("sc-sw");
        lang.HtmlLangAttribute.Should().Be("html-sw");
        lang.AngularLocale.Should().Be("ng-sw");
        cultureSerializer.Verify(s => s.DeserializeAndPopulateOverride(new CultureInfo(cultureName), mergedOverride));
    }

    [Theory, ValuesData(null, "", "lol-OMG")]
    public void ShouldFail_IfInvalidDotNetCulture(string value)
    {
        cultureMapping.Add(value ?? "", cultureMapping[cultureName]);
        cultureName = value;
        RunFailedTest("TestProp", expectedMsg: new[] { value, "supported .NET culture" });
    }

    [Theory, BooleanData]
    public void ShouldFail_IfOverridesFailed(bool failMerge)
    {
        var ex = new Exception("Oups", new Exception("Wtf"));
        if (failMerge)
            cultureOverridesMerger.SetupWithAnyArgs(m => m.MergeOverridesChain(null, null)).Throws(ex);
        else
            cultureSerializer.SetupWithAnyArgs(s => s.DeserializeAndPopulateOverride(null, null)).Throws(ex);

        var invalidProp = nameof(GlobalizationConfigurationDto.CultureOverrides);
        RunFailedTest(invalidProp, expectedMsg: new[] { invalidProp, "'sw-KE'", "Oups", "Wtf" });
    }

    [Fact]
    public void ShouldFail_IfMissingCultureMappingEntry()
    {
        cultureName = "de-AT";
        var invalidProp = nameof(GlobalizationConfigurationDto.CultureMapping);
        RunFailedTest(invalidProp, expectedMsg: new[] { invalidProp, "missing", "'de-AT'", "TestProp" });
    }

    [Fact]
    public void ShouldFail_IfFailedToCreateLanguageInfo()
    {
        cultureMapping.Values.Single().RouteValue = "Invalid ?!@";

        var invalidProp = nameof(GlobalizationConfigurationDto.CultureMapping);
        RunFailedTest(invalidProp, expectedMsg: new[] { $"{invalidProp}['sw-KE'].RouteValue", "TestProp", "nice URLs" });
    }

    private void RunFailedTest(string invalidProperty, string[] expectedMsg)
    {
        Action act = () => target.Create(cultureName, "TestProp", cultureMapping, null);

        var error = act.Should().Throw<InvalidConfigurationException>().Which.Errors.Single();
        error.MemberNames.Should().BeEquivalentTo(invalidProperty);
        error.ErrorMessage.Should().ContainAll(expectedMsg);
    }
}
