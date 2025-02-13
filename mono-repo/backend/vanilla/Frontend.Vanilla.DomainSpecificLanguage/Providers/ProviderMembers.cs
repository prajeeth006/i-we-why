using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Collects all members of DSL providers.
/// </summary>
internal interface IProviderMembers
{
    IReadOnlyList<ProviderMember> Members { get; }
}

internal sealed class ProviderMembers : IProviderMembers
{
    public IReadOnlyList<ProviderMember> Members { get; }

    public ProviderMembers(IEnumerable<DslValueProvider> providers, IProviderMemberAccessorFactory accessorFactory)
        => Members = providers
            .CheckNoDuplicatesBy(p => p.Name, StringComparer.OrdinalIgnoreCase)
            .SelectMany(p => p.ExposedType
                .GetMembers()
                .Where(m => !(m is MethodInfo i) || !i.IsSpecialName) // Skip accessor methods (e.g. getters) because their counterparts are listed anyway
                .Select(m => GetMember(m, p, accessorFactory)))
            .ToArray();

    private ProviderMember GetMember(MemberInfo clrMember, DslValueProvider provider, IProviderMemberAccessorFactory accessorFactory)
    {
        try
        {
            var memberDetails = CollectMemberSpecificDetails(clrMember);
            var dslType = ToDslType(memberDetails.ReturnType, desc: "Return type");
            var dslParameters = memberDetails.Parameters.Select(p =>
                new ProviderMemberParameter(ToDslType(p.ParameterType, $"Type of parameter '{p.Name}'"), new Identifier(p.Name!)));
            var documentation = clrMember.Get<DescriptionAttribute>()?.Description.WhiteSpaceToNull()
                                ?? throw new Exception($"Missing {typeof(DescriptionAttribute)} with valid documentation for customers.");
            var volatility = clrMember.Get<ValueVolatilityAttribute>()?.Volatility
                             ?? provider.ExposedType.Get<ValueVolatilityAttribute>()?.Volatility
                             ?? default;
            var obsoleteMessageStr = (clrMember.Get<ObsoleteAttribute>() is var memberAttr ? memberAttr?.Message.WhiteSpaceToNull() : null)
                                     ?? (provider.ExposedType.Get<ObsoleteAttribute>() is var providerAttr ? providerAttr?.Message.WhiteSpaceToNull() : null)
                                     ?? (memberAttr != null || providerAttr != null ? "Ask corresponding developers for more details." : null);
            var obsoleteMessage = obsoleteMessageStr?.Trim().AsTrimmedRequired();
            var isClientSideOnly = (clrMember.Get<ClientSideOnlyAttribute>() ?? provider.ExposedType.Get<ClientSideOnlyAttribute>()) != null;
            var valueAccessor = accessorFactory.Create(memberDetails.Method, provider.Instance);
            var isExcludedFromDiagnostics =
                (clrMember.Get<SkipInitialValueGetOnDslPageAttribute>() ?? provider.ExposedType.Get<SkipInitialValueGetOnDslPageAttribute>()) != null;

            return new ProviderMember(
                provider.Name,
                memberDetails.Name,
                dslType,
                dslParameters,
                documentation,
                volatility,
                obsoleteMessage,
                isClientSideOnly,
                valueAccessor,
                isExcludedFromDiagnostics);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error in member {clrMember} of ExposedType {provider.ExposedType} of DSL provider with prefix '{provider.Name}'.", ex);
        }
    }

    private static (MethodInfo Method, Identifier Name, Type ReturnType, IEnumerable<ParameterInfo> Parameters) CollectMemberSpecificDetails(MemberInfo member)
    {
        switch (member)
        {
            case PropertyInfo property:
                if (property.SetMethod != null || property.GetMethod == null)
                    throw UnsupportedError("Property setter");
                if (property.GetMethod.GetParameters().Length != 0)
                    throw UnsupportedError("Indexer");

                return (property.GetMethod, new Identifier(member.Name), property.PropertyType, Array.Empty<ParameterInfo>());

            case MethodInfo method:
                var parameters = method.GetParameters();
                var hasExecutionMode = parameters.FirstOrDefault()?.ParameterType == typeof(ExecutionMode);
                var returnType = typeof(Task).IsAssignableFrom(method.ReturnType)
                    ? method.ReturnType.GetGenericArguments().SingleOrDefault() ?? typeof(VoidDslResult)
                    : method.ReturnType == typeof(void)
                        ? typeof(VoidDslResult)
                        : method.ReturnType;

                var name = method.Name;
                const string getPrefix = "Get", asyncSuffix = "Async";

                if (name.StartsWith(getPrefix) && parameters.Length == (hasExecutionMode ? 1 : 0))
                    name = name.Substring(getPrefix.Length); // User.GetName() => User.Name

                if (name.EndsWith("Async"))
                    name = name.Substring(0, name.Length - asyncSuffix.Length);

                return (method, new Identifier(name), returnType, parameters.Skip(hasExecutionMode ? 1 : 0));

            default:
                throw UnsupportedError($"Member of type {member.MemberType}");
        }
    }

    private static readonly IReadOnlyDictionary<Type, DslType> TypeMapping = Enum<DslType>.Values
        .ToDictionary(t => t.ToClrType());

    private static DslType ToDslType(Type clrType, string desc)
        => TypeMapping.TryGetValue(clrType, out var dslType)
            ? dslType
            : throw new Exception($"{desc} which is {clrType} is not supported in Vanilla DSL. Only these types are supported: {TypeMapping.Keys.Join()}.");

    private static Exception UnsupportedError(string memberType)
        => new ($"{memberType} is not supported in Vanilla DSL. Only property getters and methods are supported.");
}
