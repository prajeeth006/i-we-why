using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;

/// <summary>
/// Creates <see cref="ProviderAccess" /> mapped to corresponding member.
/// </summary>
internal interface IProviderAccessFactory
{
    WithWarnings<IExpressionTree> Create(TrimmedRequiredString providerName, TrimmedRequiredString memberName, IEnumerable<IExpressionTree> parameters);
}

internal sealed class ProviderAccessFactory(IProviderMembers providerMembers) : IProviderAccessFactory
{
    public WithWarnings<IExpressionTree> Create(TrimmedRequiredString providerName, TrimmedRequiredString memberName, IEnumerable<IExpressionTree> parameters)
    {
        var fromRequestedProvider = providerMembers.Members.Where(m => m.ProviderName.Equals(providerName)).ToList();

        if (fromRequestedProvider.Count == 0)
            throw new DslArgumentException($"There is no DSL provider with Name '{providerName}'."
                                           + $" Existing providers: {providerMembers.Members.Select(m => m.ProviderName).Distinct().Dump()}.");

        var withRequestedName = fromRequestedProvider.Where(m => m.MemberName.Equals(memberName)).ToList();

        if (withRequestedName.Count == 0)
            throw new DslArgumentException($"There is no member (property or function) '{memberName}' on DSL provider with Name '{providerName}'."
                                           + $" Existing members: {fromRequestedProvider.Select(m => m.MemberName).Distinct().Dump()}.");

        if (withRequestedName.Count > 1)
        {
            parameters = parameters.Enumerate();
            var parameterTypes = parameters.Select(p => p.ResultType).ToList();
            var overloads = withRequestedName.Where(m => m.Parameters.Select(p => p.Type).SequenceEqual(parameterTypes)).ToList();

            if (overloads.Count != 1)
                throw new DslArgumentException(
                    $"There are multiple members (overloads) of '{providerName}.{memberName}' but none of them has parameters as specified: {parameterTypes.Dump()}."
                    + $" Existing overloads: {withRequestedName.Join()}.");

            withRequestedName = overloads;
        }

        var member = withRequestedName.Single();
        var access = new ProviderAccess(member, parameters);

        return member.ObsoleteMessage == null
            ? access
            : access.WithWarnings<IExpressionTree>(
                $"DSL provider member '{member.ProviderName}.{member.MemberName}' is obsolete. Stop using it as soon as possible. {member.ObsoleteMessage}");
    }
}
