using System;
using FluentAssertions;
using Frontend.Vanilla.Caching.Hekaton;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class VanillaContentServicesTests
{
    private IServiceCollection services;

    public VanillaContentServicesTests()
    {
        services = new ServiceCollection()
            .AddVanillaSitecoreContent()
            .AddVanillaDomainSpecificLanguage()
            .AddFakeVanillaDslProviders()
            .AddSingleton<IConfigurationEngine, FakeConfigurationFactory>()
            .AddSingleton(Mock.Of<IEnvironmentProvider>())
            .AddSingleton(new Mock<IConfiguration>().WithConnectionStrings().Object);
    }

    [Theory]
    [InlineData(typeof(IDocumentIdFactory))]
    [InlineData(typeof(TemplateAssemblySource))]
    [InlineData(typeof(IContentLoader))]
    [InlineData(typeof(IContentService))]
    [InlineData(typeof(IEditorOverridesResolver))]
    [InlineData(typeof(IMenuFactory))]
    public void ShouldResolve(Type type)
        => services.BuildServiceProvider().GetRequiredService(type);

    [Theory]
    [InlineData(typeof(IFieldPlaceholderReplacer), 6)]
    [InlineData(typeof(IHealthCheck), 3)]
    public void ShouldResolveServices(Type type, int expectedCount)
    {
        var objs = services.AddSingleton(Mock.Of<IHekatonConfiguration>()).BuildServiceProvider().GetServices(type);
        objs.Should().HaveCount(expectedCount);
    }
}
