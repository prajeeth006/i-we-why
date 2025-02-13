using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Proxy;

public class RoslynProxyCompilerTests
{
    private static readonly IRoslynProxyCompiler Target = RoslynProxyCompiler.Singleton;

    [Fact]
    public void ShouldCompileType()
    {
        var code = @"namespace Test
            {
                internal class Greeter : " + typeof(RoslynProxyCompilerTests) + "." + nameof(IGreeter) + @"
                {
                    public string GetGreeting()
                    {
                        return ""Hello there. General Kenobi!"";
                    }
                }
            }";

        // Act
        var type = Target.CompileTypes(code).Single(p => p.FullName == "Test.Greeter");

        var greeter = (IGreeter)Activator.CreateInstance(type);
        var msg = greeter.GetGreeting();
        msg.Should().Be("Hello there. General Kenobi!");
    }

    public interface IGreeter
    {
        string GetGreeting();
    }

    [Fact]
    public void ShouldWrapException()
    {
        const string code = @"namespace Test
            {
                internal class Greeter
                {
                    public string GetGreeting();
                }
            }";

        Action act = () => Target.CompileTypes(code); // Act

        var ex = act.Should().Throw().Which;
        ex.Message.Should().ContainAll("Failed to compile", "CS0501: (4,34)-(4,45) - 'Greeter.GetGreeting()' must declare a body", code);
    }
}
