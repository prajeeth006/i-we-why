using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.ManipulationService;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides.ManipulationService;

public class ClearOverridesCommandTests
{
    private IClearOverridesCommand target;
    private Mock<IOverridesStorage> storage;

    public ClearOverridesCommandTests()
    {
        storage = new Mock<IOverridesStorage>();
        target = new ClearOverridesCommand(storage.Object);
    }

    [Fact]
    public void ShouldSetEmptyJson()
    {
        // Act
        target.Clear();

        storage.Verify(s => s.Set(new JObject()));
    }
}
