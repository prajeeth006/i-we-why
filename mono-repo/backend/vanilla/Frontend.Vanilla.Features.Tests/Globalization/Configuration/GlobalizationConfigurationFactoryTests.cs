using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Configuration;

public class GlobalizationConfigurationFactoryTests
{
    private SimpleConfigurationFactory<IGlobalizationConfiguration, GlobalizationConfigurationDto> target;
    private GlobalizationConfigurationDto dto;
    private Mock<ILanguageFactory> langFactory;

    private LanguageInfo enLang;
    private LanguageInfo deLang;
    private LanguageInfo esLang;
    private LanguageInfo frLang;
    private LanguageInfo elLang;

    public GlobalizationConfigurationFactoryTests()
    {
        dto = new GlobalizationConfigurationDto
        {
            DefaultCultureName = "en-US",
            AllowedCultureNames = new List<string> { "en-US", "de-AT", "es-ES" },
            OfflineCultureNames = new List<string> { "fr-FR" },
            HiddenCultureNames = new List<string> { "es-ES" },
            InternalCultureNames = new List<string> { "el-GR" },
            CultureMapping = new Dictionary<string, LanguageInfoDto>(),
            CultureOverrides = new Dictionary<string, JObject> { { "fr-FR", new JObject() } },
            UseBrowserLanguage = true,
        };
        langFactory = new Mock<ILanguageFactory>();
        target = new GlobalizationConfigurationFactory(langFactory.Object);

        enLang = SetupLangFactory("en-US");
        deLang = SetupLangFactory("de-AT");
        esLang = SetupLangFactory("es-ES");
        frLang = SetupLangFactory("fr-FR");
        elLang = SetupLangFactory("el-GR");
    }

    private LanguageInfo SetupLangFactory(string inputCulture, string routeValue = null, string nativeName = null)
    {
        var lang = TestLanguageInfo.Get(inputCulture, routeValue, nativeName);
        langFactory.Setup(b => b.Create(inputCulture, It.IsNotNull<string>(), dto.CultureMapping, dto.CultureOverrides)).Returns(lang);

        return lang;
    }

    [Fact]
    public void ShouldCreateValidConfig()
    {
        // Act
        var result = target.Create(dto);

        result.DefaultLanguage.Should().BeSameAs(enLang);
        result.AllowedLanguages.Should().BeEquivalentTo(new[] { enLang, deLang, esLang });
        result.OfflineLanguages.Should().BeEquivalentTo(new[] { frLang });
        result.HiddenLanguages.Should().BeEquivalentTo(new[] { esLang });
        result.InternalLanguages.Should().BeEquivalentTo(new[] { elLang });
        result.SearchEngineLanguage.Should().BeNull();
        result.UseBrowserLanguage.Should().BeTrue();

        langFactory.Verify(b => b.Create("en-US", nameof(dto.DefaultCultureName), dto.CultureMapping, dto.CultureOverrides));
        langFactory.Verify(b => b.Create("de-AT", nameof(dto.AllowedCultureNames), dto.CultureMapping, dto.CultureOverrides));
        langFactory.Verify(b => b.Create("es-ES", nameof(dto.AllowedCultureNames), dto.CultureMapping, dto.CultureOverrides));
        langFactory.Verify(b => b.Create("fr-FR", nameof(dto.OfflineCultureNames), dto.CultureMapping, dto.CultureOverrides));
        langFactory.Verify(b => b.Create("el-GR", nameof(dto.InternalCultureNames), dto.CultureMapping, dto.CultureOverrides));
        langFactory.Invocations.Should().HaveCount(5, "langs should be cached so that reference comparison works");
    }

    private void ExpectInvalid(string invalidProperty, string errorMessage)
    {
        Action act = () => target.Create(dto);

        var ex = act.Should().Throw<InvalidConfigurationException>().Which;
        ex.Errors.SelectMany(e => e.MemberNames).ToArray().Should().BeEquivalentTo(invalidProperty);
        ex.Errors.Single().ErrorMessage.Should().Be(errorMessage);
    }

    [Fact]
    public void DefaultCultureName_ShouldFail_IfNotWithinAllowed()
    {
        dto.AllowedCultureNames.Remove("en-US");
        ExpectInvalid(nameof(dto.DefaultCultureName), $"{nameof(dto.DefaultCultureName)} 'en-US' must be part of {nameof(dto.AllowedCultureNames)}: de-AT, es-ES.");
    }

    [Fact]
    public void DefaultCultureName_ShouldFail_IfWithinHidden()
    {
        dto.HiddenCultureNames.Add("en-US");
        ExpectInvalid(nameof(dto.DefaultCultureName), $"{nameof(dto.DefaultCultureName)} 'en-US' must NOT be part of {nameof(dto.HiddenCultureNames)}: es-ES, en-US.");
    }

    [Fact]
    public void SearchEngineCultureName_ShouldFail_IfNotWithinAllowed()
    {
        dto.SearchEngineCultureName = "fr-FR";
        ExpectInvalid(nameof(dto.SearchEngineCultureName),
            $"{nameof(dto.SearchEngineCultureName)} 'fr-FR' must be part of {nameof(dto.AllowedCultureNames)}: en-US, de-AT, es-ES.");
    }

    [Fact]
    public void SearcEngineLanguage_ShouldBeCreatedIfConfigurationValueIsNotNull()
    {
        dto.SearchEngineCultureName = "es-ES";

        // Act
        var result = target.Create(dto);

        result.SearchEngineLanguage.Should().BeSameAs(esLang);
    }

    [Fact]
    public void OfflineCultureNames_ShouldFailIfIntersectionWithAllowed()
    {
        dto.AllowedCultureNames.Add("fr-FR");
        ExpectInvalid(nameof(dto.AllowedCultureNames),
            $"{nameof(dto.AllowedCultureNames)} must NOT contain any of {nameof(dto.OfflineCultureNames)} but both contain: fr-FR");
    }

    [Fact]
    public void InternalCultureNames_ShouldFailIfIntersectionWithAllowed()
    {
        dto.AllowedCultureNames.Add("el-GR");
        ExpectInvalid(nameof(dto.AllowedCultureNames),
            $"{nameof(dto.AllowedCultureNames)} must NOT contain any of {nameof(dto.InternalCultureNames)} but both contain: el-GR");
    }

    [Fact]
    public void InternalCultureNames_ShouldFailIfIntersectionWithOffline()
    {
        dto.OfflineCultureNames.Add("el-GR");
        ExpectInvalid(nameof(dto.InternalCultureNames),
            $"{nameof(dto.InternalCultureNames)} must NOT contain any of {nameof(dto.OfflineCultureNames)} but both contain: el-GR");
    }

    [Fact]
    public void HiddenCultureNames_ShouldFailIfNotPartOfAllowed()
    {
        dto.AllowedCultureNames.Remove("es-ES");
        ExpectInvalid(nameof(dto.HiddenCultureNames),
            $"All {nameof(dto.HiddenCultureNames)} must be part of {nameof(dto.AllowedCultureNames)} but these are NOT: es-ES.");
    }

    [Fact]
    public void CultureMapping_RouteValue_ShouldFailIfNotUnique()
    {
        SetupLangFactory("en-US", routeValue: "foo");
        SetupLangFactory("es-ES", routeValue: "foo");
        SetupLangFactory("fr-FR", routeValue: "foo"); // Offline should matter too
        SetupLangFactory("el-GR", routeValue: "foo"); // Internal should matter too

        ExpectInvalid(nameof(dto.CultureMapping),
            $"Each one of {nameof(dto.AllowedCultureNames)}, {nameof(dto.InternalCultureNames)} and {nameof(dto.OfflineCultureNames)} must map to unique {nameof(LanguageInfo.RouteValue)}"
            + $" specified in {nameof(dto.CultureMapping)} to determine language from URL but same RouteValue 'foo' is specified for cultures: en-US, es-ES, fr-FR, el-GR.");
    }

    [Fact]
    public void CultureMapping_ShouldFailIfNotUniqueNativeNames()
    {
        enLang = SetupLangFactory("en-US", nativeName: "foo");
        esLang = SetupLangFactory("es-ES", nativeName: "foo");
        frLang = SetupLangFactory("fr-FR", nativeName: "foo"); // Offline should NOT matter
        elLang = SetupLangFactory("el-GR", nativeName: "foo"); // Internal should matter too

        ExpectInvalid(nameof(dto.CultureMapping),
            $"Each one of {nameof(dto.AllowedCultureNames)} must map to unique {nameof(LanguageInfo.NativeName)} specified"
            + $" in {nameof(dto.CultureMapping)} so that user can clearly choose between them but same NativeName 'foo' is specified for cultures: en-US, es-ES, el-GR.");
    }
}
