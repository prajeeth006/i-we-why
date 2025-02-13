#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public abstract class SyntaxTestBase<TProvider>
    where TProvider : class
{
    protected Mock<TProvider> Provider { get; private set; }
    private IDslCompiler compiler;
    private IProviderMembers providerMembers;
    private DslValueProvider providerReg;
    protected ExecutionMode Mode => ExecutionMode.Sync;
    private static List<string> untestedMembers = new List<string>();

    public SyntaxTestBase()
    {
        Provider = new Mock<TProvider>();

        var services = new ServiceCollection()
            .AddVanillaDomainSpecificLanguage()
            .AddFakeVanillaDslProviders()
            .AddSingleton(Provider.Object)
            .BuildServiceProvider();

        compiler = services.GetRequiredService<IDslCompiler>();
        providerMembers = services.GetRequiredService<IProviderMembers>();
        providerReg = services.GetRequiredService<IEnumerable<DslValueProvider>>().Single(p => p.ExposedType == typeof(TProvider));

        untestedMembers ??= providerMembers.Members
            .Where(m => m.ProviderName == providerReg.Name)
            .Select(m => $"{m.ProviderName}.{m.MemberName}")
            .ToList();
    }

    [Fact, Order(1)]
    public void ShouldTestAllMembers()
    {
        if (untestedMembers.Count > 0)
            throw new Exception($"All members of {typeof(TProvider).Name} must be tested in {GetType()}"
                                + $" but these aren't: {untestedMembers.Dump()}.");
    }

    protected IDslExpression<T> ShouldBeCompilable<T>(string expression)
        where T : notnull
    {
        var (compiledExpr, _) = compiler.Compile<T>(expression);

        var i = expression.IndexOf("(", StringComparison.OrdinalIgnoreCase);
        var fullMember = i >= 0 ? expression.Substring(0, i) : expression; // Remove function params
        untestedMembers.Remove(fullMember);

        return compiledExpr;
    }

    protected void EvaluateAndExpect<T>(string expression, T expected)
        where T : notnull
    {
        var compiledExpr = ShouldBeCompilable<T>(expression);
        compiledExpr.Evaluate().Should().Be(expected);
    }

    protected void Execute(string script)
    {
        var action = ShouldBeCompilable<VoidDslResult>(script);
        action.Evaluate();
    }
}
