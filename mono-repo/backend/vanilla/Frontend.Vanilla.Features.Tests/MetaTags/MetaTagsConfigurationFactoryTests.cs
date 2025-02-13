using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.MetaTags;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.MetaTags;

public class MetaTagsConfigurationFactoryTests
{
    private SimpleConfigurationFactory<IMetaTagsConfiguration, MetaTagsConfigurationDto> target;
    private MetaTagsConfigurationDto dto;

    public MetaTagsConfigurationFactoryTests()
    {
        target = new MetaTagsConfigurationFactory();
        dto = new MetaTagsConfigurationDto
        {
            PageMetaTags = new Dictionary<string, PageMetaTagsRuleDto>
            {
                ["/page1"] = new PageMetaTagsRuleDto
                {
                    Title = "Title 1",
                    Tags = new Dictionary<string, string>
                    {
                        { "Tag 1", "Value 1" },
                        { "Tag 2", "Value 2" },
                    },
                },
                ["/page1?q=1&p=2"] = new PageMetaTagsRuleDto
                {
                    Title = "Highest priority",
                },
                ["/page2"] = new PageMetaTagsRuleDto
                {
                    Description = "Without Title",
                },
            },
            GlobalMetaTags = new Dictionary<string, GlobalMetaTagsRuleDto>
            {
                ["2. Rule"] = new GlobalMetaTagsRuleDto
                {
                    Tags = new Dictionary<string, string>
                    {
                        { "Global ", "Global Value 2" },
                    },
                    UrlPathAndQueryRegexes = new List<string> { "URL Regex 2.1", "URL Regex 2.2" },
                },
                ["1. Rule"] = new GlobalMetaTagsRuleDto
                {
                    Tags = new Dictionary<string, string>
                    {
                        { "Global 1.1", "Global Value 1.1" },
                        { "Global 1.2", "Global Value 1.2" },
                    },
                    UrlPathAndQueryRegexes = new List<string> { "URL Regex 1" },
                },
            },
        };
    }

    [Fact]
    public void ShouldCreateConfiguration()
    {
        var config = target.Create(dto); // Act

        config.Should().BeEquivalentTo(
            new MetaTagsConfiguration(
                pageMetaTags: new[] // Should put rules with query as first ones
                {
                    new PageMetaTagsRule(
                        "/page1",
                        urlQueryParams: new Dictionary<string, string>
                        {
                            { "q", "1" },
                            { "p", "2" },
                        },
                        title: "Highest priority",
                        tags: new Dictionary<string, string>()),
                    new PageMetaTagsRule(
                        "/page1",
                        urlQueryParams: new Dictionary<string, string>(),
                        title: "Title 1",
                        tags: new Dictionary<string, string>
                        {
                            { "Tag 1", "Value 1" },
                            { "Tag 2", "Value 2" },
                        }),
                    new PageMetaTagsRule(
                        "/page2",
                        urlQueryParams: new Dictionary<string, string>(),
                        title: null,
                        tags: new Dictionary<string, string>
                        {
                            { "description", "Without Title" },
                        }),
                },
                globalMetaTags: new[] // Should sort by rule name
                {
                    new GlobalMetaTagsRule(
                        "1. Rule",
                        tags: new Dictionary<string, string>
                        {
                            { "Global 1.1", "Global Value 1.1" },
                            { "Global 1.2", "Global Value 1.2" },
                        },
                        urlPathAndQueryRegexes: new[] { "URL Regex 1" }),
                    new GlobalMetaTagsRule(
                        "2. Rule",
                        tags: new Dictionary<string, string> { { "Global ", "Global Value 2" } },
                        urlPathAndQueryRegexes: new[] { "URL Regex 2.1", "URL Regex 2.2" }),
                }));
    }

    [Theory]
    [InlineData("not-rooted")]
    public void ShouldFail_IfPageMetaTagsKey_NotRootedRelativeUrl(string url)
    {
        dto.PageMetaTags.Add(url, new PageMetaTagsRuleDto());

        RunInvalidConfigTest($"{nameof(dto.PageMetaTags)}[{url}] - Page URL (key) must be valid rooted (starting with slash '/') relative URL.");
    }

    [Fact]
    public void ShouldFail_IfPageMetaTagsKey_ContainsFragmentOrInvalidQuery()
    {
        dto.PageMetaTags.Add("/path1#invalid", new PageMetaTagsRuleDto());
        dto.PageMetaTags.Add("/path2?=empty", new PageMetaTagsRuleDto());
        dto.PageMetaTags.Add("/path3?q=1&q=2", new PageMetaTagsRuleDto());

        RunInvalidConfigTest(
            $"{nameof(dto.PageMetaTags)}[/path1#invalid] - Page URL (key) contains fragment '#invalid' which isn't supported.",
            $"{nameof(dto.PageMetaTags)}[/path2?=empty] - Query string parameter in page URL (key) can't be empty nor white-space string but there is one with value 'empty'.",
            $"{nameof(dto.PageMetaTags)}[/path3?q=1&q=2] - Query string parameter 'q' in page URL (key) is specified multiple times with values '1', '2' which isn't supported.");
    }

    [Fact]
    public void ShouldFail_IfPageMetaTagsKey_Conflicting()
    {
        dto.PageMetaTags.Add("/conflict1", new PageMetaTagsRuleDto());
        dto.PageMetaTags.Add("/CONFLICT1", new PageMetaTagsRuleDto());
        dto.PageMetaTags.Add("/conflict2?q=1&p=a", new PageMetaTagsRuleDto());
        dto.PageMetaTags.Add("/conflict2?P=A&Q=1", new PageMetaTagsRuleDto());

        RunInvalidConfigTest(
            $"{nameof(dto.PageMetaTags)} - Multiple rules have semantically equal page URL (key) (case-insensitive comparison, any order of query parameters)"
            + " hence they are in conflict: '/conflict1' vs. '/CONFLICT1'.",
            $"{nameof(dto.PageMetaTags)} - Multiple rules have semantically equal page URL (key) (case-insensitive comparison, any order of query parameters)"
            + " hence they are in conflict: '/conflict2?q=1&p=a' vs. '/conflict2?P=A&Q=1'.");
    }

    private void RunInvalidConfigTest(params string[] expectedErrors)
    {
        Action act = () => target.Create(dto);

        var validationResults = expectedErrors.Select(e => new ValidationResult(e, new[] { nameof(dto.PageMetaTags) }));
        act.Should().Throw<InvalidConfigurationException>()
            .Which.Errors.Should().BeEquivalentTo(validationResults);
    }
}
