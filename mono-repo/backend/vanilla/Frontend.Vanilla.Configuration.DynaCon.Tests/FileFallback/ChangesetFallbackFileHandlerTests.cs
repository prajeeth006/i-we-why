using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public class ChangesetFallbackFileHandlerTests
{
    private IFallbackFileDataHandler<IValidChangeset> target;
    private TenantSettings settings;
    private Mock<IChangesetDeserializer> deserializer;

    public ChangesetFallbackFileHandlerTests()
    {
        settings = TestSettings.GetTenant(changesetFallbackFile: OperatingSystemRootedPath.GetRandom());
        deserializer = new Mock<IChangesetDeserializer>();
        target = new ChangesetFallbackFileHandler(settings, deserializer.Object);
    }

    [Fact]
    public void FilePath_ShouldGetFromSettings()
        => target.Path.Should().Be(settings.ChangesetFallbackFile);

    [Fact]
    public void Parameters_ShouldGetFromSettings()
        => target.Parameters.Should().BeSameAs(settings.Parameters);

    [Fact]
    public void Deserialize_ShouldUseDeserializer()
    {
        var changeset = Mock.Of<IValidChangeset>();
        var dto = new FallbackDto
        {
            Changeset = TestConfigDto.Create(),
            ContextHierarchy = TestCtxHierarchy.Get(),
        };
        deserializer.Setup(d => d.Deserialize(dto.Changeset, dto.ContextHierarchy, ConfigurationSource.FallbackFile)).Returns(changeset);

        // Act
        var result = target.Deserialize(dto);

        result.Should().BeSameAs(changeset);
    }

    [Fact]
    public void Serialize_ShouldBuildDto()
    {
        var changesetDto = TestConfigDto.Create();
        var ctxHierarchy = TestCtxHierarchy.Get();
        var changeset = Mock.Of<IValidChangeset>(c => c.Dto == changesetDto && c.ContextHierarchy == ctxHierarchy);

        // Act
        var dto = target.Serialize(changeset);

        dto.Should().BeEquivalentTo(new FallbackDto
        {
            Changeset = changesetDto,
            ContextHierarchy = ctxHierarchy,
        });
    }
}
