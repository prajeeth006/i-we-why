using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

/// <summary>
/// Tests that CLR names are not changed because they are used in AppDynamics reports.
/// </summary>
public sealed class AppDynamicsContractTests
{
    [Theory]
    [InlineData(typeof(IConfigurationRestClient), "Frontend.Vanilla.Configuration.DynaCon.RestService.IConfigurationRestClient")]
    [InlineData(typeof(IConfigurationRestService), "Frontend.Vanilla.Configuration.DynaCon.RestService.IConfigurationRestService")]
    public void ShouldKeepTypeNames(Type type, string expectedFullName)
        => type.FullName.Should().Be(expectedFullName);

    [Theory]
    [InlineData(nameof(IConfigurationRestClient.Execute), "Execute")]
    [InlineData(nameof(IConfigurationRestService.GetConfiguration), "GetConfiguration")]
    [InlineData(nameof(IConfigurationRestService.GetConfigurationChanges), "GetConfigurationChanges")]
    [InlineData(nameof(IConfigurationRestService.GetCurrentConfiguration), "GetCurrentConfiguration")]
    [InlineData(nameof(ConfigurationRestService.PostFeedback), "PostFeedback")]
    public void ShouldKeepMethodNames(string actual, string expected)
        => actual.Should().Be(expected);
}
