using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public class ContextHierarchyFallbackFileHandlerTests
{
    private IFallbackFileDataHandler<VariationContextHierarchy> target;
    private DynaConEngineSettings settings;

    public ContextHierarchyFallbackFileHandlerTests()
    {
        settings = TestSettings.Get(s =>
        {
            s.ChangesetFallbackFile = OperatingSystemRootedPath.GetRandom();
            s.ContextHierarchyFallbackFile = OperatingSystemRootedPath.GetRandom();
        });
        target = new ContextHierarchyFallbackFileHandler(settings);
    }

    [Fact]
    public void FilePath_ShouldGetFromSettings()
        => target.Path.Should().Be(settings.ContextHierarchyFallbackFile);

    [Fact]
    public void Parameters_ShouldGetFromSettings()
        => target.Parameters.Should().BeSameAs(settings.TenantBlueprint.Parameters);

    [Fact]
    public void Deserialize_ShouldUseDeserializer()
    {
        var ctxHierarchy = new Dictionary<string, IReadOnlyDictionary<string, string>> { ["Label"] = new Dictionary<string, string> { { "bwin.com", null } } };
        var dto = new FallbackDto { ContextHierarchy = new VariationHierarchyResponse(ctxHierarchy) };

        // Act
        var result = target.Deserialize(dto);

        result.Hierarchy.Should().BeEquivalentTo(ctxHierarchy);
        result.Source.Should().Be(ConfigurationSource.FallbackFile);
    }

    [Fact]
    public void Serialize_ShouldBuildDto()
    {
        var ctxHierarchy = TestCtxHierarchy.Get();

        // Act
        var dto = target.Serialize(ctxHierarchy);

        dto.Should().BeEquivalentTo(new FallbackDto { ContextHierarchy = ctxHierarchy });
    }
}
