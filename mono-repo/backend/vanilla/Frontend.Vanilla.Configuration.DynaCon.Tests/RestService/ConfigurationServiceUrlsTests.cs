using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Uris;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

public sealed class ConfigurationServiceUrlsTests
{
    private IConfigurationServiceUrls target;

    public ConfigurationServiceUrlsTests()
    {
        var settings = new DynaConEngineSettingsBuilder
        {
            Host = new HttpUri("http://dynacon.bwin.com/api"),
            ApiVersion = "v3",
            AdminWeb = new HttpUri("http://dynacon.bwin.com/admin"),
            Parameters =
            {
                new DynaConParameter("service", "vanilla:1"),
                new DynaConParameter("service", "account:2"),
                new DynaConParameter("context.label", "bwin.com"),
            },
        }.Build();
        target = new ConfigurationServiceUrls(settings, settings.TenantBlueprint);
    }

    [Fact]
    public void CurrentChangeset_Test()
        => target.CurrentChangeset.Should()
            .Be(new Uri("http://dynacon.bwin.com/api/v3/configuration?service=vanilla%3A1&service=account%3A2&context.label=bwin.com&enableExtendedContext=true"));

    [Fact]
    public void ChangesetHistory_Test()
        => target.ChangesetHistoryAdmin.Should().Be(new Uri("http://dynacon.bwin.com/admin/goto/history?service=vanilla%3A1&service=account%3A2&context.label=bwin.com"));

    [Fact]
    public void ValidatableChangesets_Test()
        => target.ValidatableChangesets.Should()
            .Be(new Uri(
                "http://dynacon.bwin.com/api/v3/configuration/validatablechangesets?service=vanilla%3A1&service=account%3A2&context.label=bwin.com&enableExtendedContext=true"));

    [Fact]
    public void Changeset_Test()
        => target.Changeset(123).Should()
            .Be(new Uri(
                "http://dynacon.bwin.com/api/v3/configuration?service=vanilla%3A1&service=account%3A2&context.label=bwin.com&enableExtendedContext=true&changesetId=123"));

    [Fact]
    public void ConfigurationChanges_Test()
        => target.ConfigurationChanges(123).Should()
            .Be(new Uri(
                "http://dynacon.bwin.com/api/v3/configuration/changes/expand?service=vanilla%3A1&service=account%3A2&context.label=bwin.com&enableExtendedContext=true&fromChangesetId=123"));

    [Theory]
    [InlineData(null,
        "http://dynacon.bwin.com/api/v3/configuration/feedback?service=vanilla%3A1&service=account%3A2&context.label=bwin.com&enableExtendedContext=true&changesetId=123")]
    [InlineData(777L,
        "http://dynacon.bwin.com/api/v3/configuration/feedback?service=vanilla%3A1&service=account%3A2&context.label=bwin.com&enableExtendedContext=true&changesetId=123&commitId=777")]
    public void Feedback_Test(long? commitId, string expectedUrl)
        => target.Feedback(123, commitId).Should().Be(new Uri(expectedUrl));

    [Fact]
    public void ServiceAdminPattern_Test()
        => target.ServiceAdminPattern.Should().Be("http://dynacon.bwin.com/admin/goto?service={0}");

    [Fact]
    public void FeatureAdminPattern_Test()
        => target.FeatureAdminPattern.Should().Be("http://dynacon.bwin.com/admin/goto?service=vanilla%3A1&service=account%3A2&feature={0}");

    [Fact]
    public void ChangesetAdminPattern_Test()
        => target.ChangesetAdminPattern.Should().Be("http://dynacon.bwin.com/admin/changesets/{0}");
}
