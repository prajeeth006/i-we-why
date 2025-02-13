using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides;

public sealed class ChangesetOverriderTests
{
    private IChangesetOverrider target;
    private Mock<IChangesetDeserializer> deserializer;
    private Mock<IOverridesJsonMerger> jsonMerger;

    public ChangesetOverriderTests()
    {
        deserializer = new Mock<IChangesetDeserializer>();
        jsonMerger = new Mock<IOverridesJsonMerger>();
        target = new ChangesetOverrider(deserializer.Object, jsonMerger.Object);
    }

    [Fact]
    public void ShouldApplyOverrides()
    {
        var dto = TestConfigDto.Create(666);
        var ctxHierarchy = TestCtxHierarchy.Get();
        var overrides = new JObject { { "Overide", new JValue("Hello") } };
        var changeset = Mock.Of<IValidChangeset>(c => c.Dto == dto && c.ContextHierarchy == ctxHierarchy);
        var deserialized = Mock.Of<IValidChangeset>();

        jsonMerger.Setup(m => m.Merge(It.Is<JObject>(j => j.Value<long>("ChangesetId") == 666), overrides))
            .Callback<JObject, JObject>((json1, json2) => json1["ChangesetId"] = new JValue(777));
        deserializer.Setup(d => d.Deserialize(It.Is<ConfigurationResponse>(r => r.ChangesetId == 777), ctxHierarchy, ConfigurationSource.LocalOverrides))
            .Returns(deserialized);

        // Act
        var result = target.Override(changeset, overrides);

        result.Should().BeSameAs(deserialized);
    }
}
