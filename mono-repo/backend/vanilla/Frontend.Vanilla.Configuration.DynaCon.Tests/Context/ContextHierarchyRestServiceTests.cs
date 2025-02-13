using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public sealed class ContextHierarchyRestServiceTests
{
    private IContextHierarchyRestService target;
    private Mock<IConfigurationRestClient> restClient;

    public ContextHierarchyRestServiceTests()
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
        };
        restClient = new Mock<IConfigurationRestClient>();
        target = new ContextHierarchyRestService(settings.Build(), restClient.Object);
    }

    [Fact]
    public void Url_ShouldBeCorrect()
        => target.Url.Should().Be(new Uri("http://dynacon.bwin.com/api/v3/configuration/variationhierarchy?service=vanilla%3A1&service=account%3A2"));

    [Fact]
    public void Get_ShouldDownloadHierarchy()
    {
        var ctxHierarchy = new Dictionary<string, IReadOnlyDictionary<string, string>> { ["Label"] = new Dictionary<string, string> { { "bwin.com", null } } };
        var dto = new VariationHierarchyResponse(ctxHierarchy);
        restClient.SetupWithAnyArgs(c => c.Execute<VariationHierarchyResponse>(null, null)).Returns(dto);

        // Act
        var result = target.Get();

        result.Hierarchy.Should().BeEquivalentTo(ctxHierarchy);
        result.Source.Should().Be(ConfigurationSource.Service);
        var args = restClient.Invocations.Single().Arguments;
        args[0].Should().BeEquivalentTo(new RestRequest(target.Url));
        args[1].Should().BeNull();
    }
}
