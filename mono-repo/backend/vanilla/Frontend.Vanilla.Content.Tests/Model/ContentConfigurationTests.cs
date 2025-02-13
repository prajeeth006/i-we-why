using System;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Model;

public class ContentConfigurationTests
{
    private ContentConfigurationBuilder target;

    public ContentConfigurationTests()
        => target = new ContentConfigurationBuilder();

    [Fact]
    public void ShouldHaveAllRequiredPropertiesAlready()
        => new ContentConfigurationBuilder().Should().BeValid(); // Act

    [Fact]
    public void ShouldCopyAllProperties()
    {
        var config = target.Build();

        config.Host.Should().Be(new Uri("http://rest.cms.prod.env.works"));
        config.PreviewHost.Should().Be(new Uri("http://preview.rest.cms.prod.env.works"));
        config.Version.Should().Be("V5");
        config.RootNodePath.Should().Be("/");
        config.TemplatePaths.Should().Equal("/Vanilla");
        config.EditorUrlTemplate.Should().Be("http://cms.bwin.prod/sitecore/shell/Applications/Content Editor.aspx?fo={0}&la={1}&vs={2}");
        config.Environment.Should().Be("prod");
        config.CacheTimes.Should().NotBeSameAs(target.CacheTimes).And.BeEquivalentTo(target.CacheTimes);
        config.ItemPathDisplayModeEnabled.Should().Be(target.ItemPathDisplayModeEnabled);
        config.ItemPathDisplayModeMapping.Should().BeEquivalentTo(target.ItemPathDisplayModeMapping);
    }

    [Theory]
    [InlineData("http://qa1.cms.bwin.prod")]
    [InlineData("http://cms.bwin.prod")]
    public void PreviewHost_ShouldBeCalculatedFromHost(string host)
    {
        target.Host = new Uri(host);
        target.KnownEnvironmentHostPrefixes = new[] { "qa1", "qa2" };
        var config = target.Build();
        config.PreviewHost.Should().Be(new Uri("http://preview.cms.bwin.prod"));
    }

    [Theory]
    [InlineData(true, "V5")]
    [InlineData(true, "V6")]
    [InlineData(true, "V260")]
    [InlineData(false, "V4")]
    [InlineData(false, "V1")]
    [InlineData(false, "5")]
    public void Version_ShouldBeAtLeastV5(bool isValid, string version)
    {
        target.Version = version;
        target.Should().BeValidIf(
            isValid, // Act
            new ValidationResult($"{nameof(target.Version)} must be 'V5' or higher.", new[] { nameof(target.Version) }));
    }

    [Theory]
    [InlineData(true, "/")]
    [InlineData(true, "/Casino")]
    [InlineData(true, "/Vanilla/Casino")]
    [InlineData(false, "/Casino/")]
    [InlineData(false, "Casino")]
    public void TemplatePaths_ShouldRequireLeadingSlash(bool isValid, string templatePath)
    {
        target.TemplatePaths = new[] { "/Vanilla/Framework", templatePath };
        target.Should().BeValidIf(
            isValid, // Act
            new ValidationResult($"{nameof(target.TemplatePaths)} must start with a slash '/' and not end with it but there is '{templatePath}'.",
                new[] { nameof(target.TemplatePaths) }));
    }

    [Theory]
    [InlineData(true, "/")]
    [InlineData(true, "/Vanilla/bwin.com")]
    [InlineData(true, "/Vanilla/bwin.com/")]
    [InlineData(false, "Vanilla")]
    public void RootNodePath_ShouldRequireLeadingSlash(bool isValid, string rootNodePath)
    {
        target.RootNodePath = rootNodePath;
        target.Should().BeValidIf(
            isValid, // Act
            new ValidationResult($"{nameof(target.RootNodePath)} must start with a slash '/' but there is '{rootNodePath}'.", new[] { nameof(target.RootNodePath) }));
    }
}
