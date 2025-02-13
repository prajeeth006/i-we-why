using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Proxy;

public class RoslynProxyQueueTests
{
    private RoslynProxyQueue target;
    private Mock<IRoslynProxyCompiler> compiler;
    private Mock<IRoslynProxyCodeGenerator> codeGenerator;

    private IRoslynProxyBuilder builder1;
    private IRoslynProxyBuilder builder2;
    private IRoslynProxyBuilder builder3;

    public RoslynProxyQueueTests()
    {
        compiler = new Mock<IRoslynProxyCompiler>();
        codeGenerator = new Mock<IRoslynProxyCodeGenerator>();
        target = new RoslynProxyQueue(compiler.Object, codeGenerator.Object);

        builder1 = Mock.Of<IRoslynProxyBuilder>(b => b.InterfaceToProxy == typeof(IFoo1) && b.ClassNameInfix == "Wizard");
        builder2 = Mock.Of<IRoslynProxyBuilder>(b => b.InterfaceToProxy == typeof(IFoo2) && b.ClassNameInfix == "Wizard");
        builder3 = Mock.Of<IRoslynProxyBuilder>(b => b.InterfaceToProxy == typeof(IFoo2) && b.ClassNameInfix == "Knight");
        codeGenerator.Setup(g => g.GenerateClassCode(builder1)).Returns("Code 1");
        codeGenerator.Setup(g => g.GenerateClassCode(builder2)).Returns("Code 2");
        codeGenerator.Setup(g => g.GenerateClassCode(builder3)).Returns("Code 3");
    }

    public interface IFoo1 { }

    public interface IFoo2 { }

    public class Foo1WizardProxy : IFoo1 { }

    public class Foo2WizardProxy : IFoo2 { }

    public class Foo2KnightProxy : IFoo2 { }

    [Fact]
    public void Enqueue_ShouldGenerateTypesInBatch()
    {
        var compiledTypes = new[] { typeof(Foo1WizardProxy), typeof(Foo2WizardProxy), typeof(Foo2KnightProxy) };
        compiler.Setup(c => c.CompileTypes($"Code 1{Environment.NewLine}Code 2{Environment.NewLine}Code 3{Environment.NewLine}")).Returns(compiledTypes);

        // Act
        var getType1 = target.Enqueue(builder1);
        var getType2 = target.Enqueue(builder2);
        target.Enqueue(builder2); // Should be ignored
        target.Enqueue(builder3); // Should be ignored
        var getType3 = target.Enqueue(builder3);

        compiler.VerifyWithAnyArgs(c => c.CompileTypes(null), Times.Never); // Should be lazy

        new[] { getType1(), getType2(), getType3() }.Should().Equal(compiledTypes);
        compiler.VerifyWithAnyArgs(c => c.CompileTypes(null), Times.Once);
        VerifyCompiledBatches(compiledTypes);
    }

    [Fact]
    public void Enqueue_ShouldStartNewBatch_IfCallAfterCompilation()
    {
        compiler.Setup(c => c.CompileTypes($"Code 1{Environment.NewLine}")).Returns(new[] { typeof(Foo1WizardProxy) });
        compiler.Setup(c => c.CompileTypes($"Code 2{Environment.NewLine}")).Returns(new[] { typeof(Foo2WizardProxy) });
        compiler.Setup(c => c.CompileTypes($"Code 3{Environment.NewLine}")).Returns(new[] { typeof(Foo2KnightProxy) });

        // Act
        var type1 = target.Enqueue(builder1).Invoke();
        var type2 = target.Enqueue(builder2).Invoke();
        var type3 = target.Enqueue(builder3).Invoke();

        new[] { type1, type2, type3 }.Should().Equal(typeof(Foo1WizardProxy), typeof(Foo2WizardProxy), typeof(Foo2KnightProxy));
        compiler.VerifyWithAnyArgs(c => c.CompileTypes(null), Times.Exactly(3));
        VerifyCompiledBatches(new[] { type1 }, new[] { type2 }, new[] { type3 });
    }

    [Fact]
    public void Enqueue_ShouldImmediatelyThrow_IfCodeGenerationThrows()
    {
        var codeEx = new Exception("Code error");
        codeGenerator.Setup(g => g.GenerateClassCode(builder1)).Throws(codeEx);

        Action act = () => target.Enqueue(builder1);

        act.Should().Throw().SameAs(codeEx);
    }

    [Fact]
    public void GenerateClasses_ShouldGenerateAllClassesTogether()
    {
        var compiledTypes = new[] { typeof(Foo1WizardProxy), typeof(Foo2WizardProxy), typeof(Foo2KnightProxy) };
        compiler.Setup(c => c.CompileTypes($"Code 1{Environment.NewLine}Code 2{Environment.NewLine}Code 3{Environment.NewLine}")).Returns(compiledTypes);

        // Act
        var types = target.GenerateClasses(new[] { builder1, builder2, builder3 });

        types.Should().BeEquivalentTo(compiledTypes);
        compiler.VerifyWithAnyArgs(c => c.CompileTypes(null), Times.Once);
        VerifyCompiledBatches(types);
    }

    private void VerifyCompiledBatches(params IEnumerable<Type>[] expected)
    {
        var compilations = target.GetCompilations();
        compilations.Select(c => c.GeneratedClasses).Should().BeEquivalentTo(expected);
        compilations.Each(c => c.Duration.Should().BePositive());
    }
}
