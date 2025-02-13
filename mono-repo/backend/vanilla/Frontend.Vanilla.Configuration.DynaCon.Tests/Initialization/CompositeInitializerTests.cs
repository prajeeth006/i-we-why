using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Initialization;

public class CompositeInitializerTests
{
    [Fact]
    public void ShouldExecuteAllInitializers()
    {
        var executed = new List<string>();
        var target = new CompositeInitializer(new[]
        {
            MockInitializer("Init 1"),
            MockInitializer("Init 2"),
            MockInitializer("Init 3"),
        });

        // Act
        target.Initialize();

        executed.Should().Equal("Init 1", "Init 2", "Init 3");

        IConfigurationInitializer MockInitializer(string name)
        {
            var initializer = new Mock<IConfigurationInitializer>();
            initializer.Setup(i => i.Initialize()).Callback(() => executed.Add(name));

            return initializer.Object;
        }
    }
}
