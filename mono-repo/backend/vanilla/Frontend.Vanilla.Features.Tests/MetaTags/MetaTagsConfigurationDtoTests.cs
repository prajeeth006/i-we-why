using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Features.MetaTags;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.MetaTags;

public sealed class SeoMetaTagsConfigurationDtoTests
{
    private MetaTagsConfigurationDto target;

    public SeoMetaTagsConfigurationDtoTests()
        => target = new MetaTagsConfigurationDto
        {
            PageMetaTags = new Dictionary<string, PageMetaTagsRuleDto>
            {
                ["/en/page"] = new PageMetaTagsRuleDto { Title = "Test Page" },
            },
            GlobalMetaTags = new Dictionary<string, GlobalMetaTagsRuleDto>
            {
                ["MyRule"] = new GlobalMetaTagsRuleDto
                {
                    Tags = new Dictionary<string, string> { { "author", "Shakespeare" } },
                    UrlPathAndQueryRegexes = new List<string> { "(en|de)/page" },
                },
            },
        };

    [Fact]
    public void ShouldBeValid()
        => target.Should().BeValid();

    [Fact]
    public void ShouldCollectAllErrorsFromProperties()
    {
        target.PageMetaTags["/en/page"].Tags.Add("", "empty-key");
        target.GlobalMetaTags["MyRule"].Tags.Add("", "empty-key");

        var errors = target.Should().BeInvalid(); // Act

        errors.Should().HaveCount(2);
        errors[0].MemberNames.Should().Equal($"{nameof(target.PageMetaTags)}[/en/page].{nameof(PageMetaTagsRuleDto.Tags)}");
        errors[1].MemberNames.Should().Equal($"{nameof(target.GlobalMetaTags)}[MyRule].{nameof(GlobalMetaTagsRuleDto.Tags)}");
    }

    [Fact]
    public void ShouldBeInvalid_IfPageRules_ContainUselessRules()
    {
        target.PageMetaTags.Add("/en/useless", new PageMetaTagsRuleDto());

        target.Should().BeInvalid(
            new ValidationResult(
                $"{nameof(target.PageMetaTags)}[/en/useless] - {nameof(PageMetaTagsRuleDto.Title)} and {nameof(PageMetaTagsRuleDto.Description)} are null"
                + $" and no {nameof(PageMetaTagsRuleDto.Tags)} are defined. So what's the point of having this rule?",
                new[] { $"{nameof(target.PageMetaTags)}[/en/useless]" }));
    }

    [Theory, ValuesData("DESCRIPTION", "description")]
    public void ShouldBeInvalid_IfPageRules_WithDescriptionInOtherTags(string tagName)
    {
        target.PageMetaTags["/en/page"].Description = "Batman";
        target.PageMetaTags["/en/page"].Tags.Add(tagName, "Joker");

        target.Should().BeInvalid(
            new ValidationResult(
                $"{nameof(target.PageMetaTags)}[/en/page] - {nameof(PageMetaTagsRuleDto.Description)} can't be specified both in {nameof(PageMetaTagsRuleDto.Tags)} and dedicated property."
                + $" {nameof(PageMetaTagsRuleDto.Tags)}[{tagName}] is 'Joker' vs. dedicated {nameof(PageMetaTagsRuleDto.Description)} is 'Batman'.",
                new[] { $"{nameof(target.PageMetaTags)}[/en/page]" }));
    }

    [Fact]
    public void ShouldBeInvalid_IfGlobalRules_ContainInvalidRegexes()
    {
        target.GlobalMetaTags["MyRule"].UrlPathAndQueryRegexes.Add("unclosed ((");

        target.Should().BeInvalid(
            new ValidationResult(
                $"{nameof(target.GlobalMetaTags)}[MyRule] - {nameof(GlobalMetaTagsRuleDto.UrlPathAndQueryRegexes)} contain invalid regular expression 'unclosed (('"
                + " with error: Invalid pattern 'unclosed ((' at offset 11. Not enough )'s.",
                new[] { $"{nameof(target.GlobalMetaTags)}[MyRule]" }));
    }
}
