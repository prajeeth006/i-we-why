using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Moq;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;

internal static class TestProviderMember
{
    public static ProviderMember Get(
        string providerName = null,
        string memberName = null,
        DslType dslType = DslType.String,
        string documentation = "Docs",
        ValueVolatility volatility = ValueVolatility.Server,
        string obsoleteMsg = null,
        bool isClientOnly = false,
        IEnumerable<ProviderMemberParameter> parameters = null,
        ProviderMemberAccessor accessor = null,
        bool skipInitialValueGetOnDslPage = false)
        => new ProviderMember(
            new Identifier(providerName ?? "Foo" + RandomGenerator.GetInt32()),
            new Identifier(memberName ?? "Bar" + RandomGenerator.GetInt32()),
            dslType,
            parameters.NullToEmpty(),
            documentation,
            volatility,
            obsoleteMsg != null ? new TrimmedRequiredString(obsoleteMsg) : null,
            isClientOnly,
            accessor ?? Mock.Of<ProviderMemberAccessor>(),
            skipInitialValueGetOnDslPage);
}
