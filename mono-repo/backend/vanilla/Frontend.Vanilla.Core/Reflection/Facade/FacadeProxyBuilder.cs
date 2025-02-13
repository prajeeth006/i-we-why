using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection.Facade;

internal sealed class FacadeProxyBuilder : IRoslynProxyBuilder
{
    public Type InterfaceToProxy { get; }
    public TrimmedRequiredString ClassNameInfix { get; } = "Facade";
    public IReadOnlyDictionary<Type, TrimmedRequiredString> Fields { get; }

    public FacadeProxyBuilder(Type facadeInterface)
    {
        InterfaceToProxy = facadeInterface;
        Fields = facadeInterface
            .GetFlattenedInterfaceMembers()
            .Select(m => m.Get<DelegateToAttribute>()?.ServiceType)
            .WhereNotNull()
            .Distinct()
            .ToDictionary(t => t, t => (TrimmedRequiredString)t.Name.Substring(1).ToCamelCase());
    }

    public RequiredString GetPropertyGetterCode(PropertyInfo property)
    {
        var targetCode = GetTargetCodeForProperty(property);

        return $"return {targetCode};";
    }

    public RequiredString GetPropertySetterCode(PropertyInfo property)
    {
        var targetCode = GetTargetCodeForProperty(property);

        return $"{targetCode} = value;";
    }

    private string GetTargetCodeForProperty(PropertyInfo property)
    {
        var delegationAttribute = property.GetRequired<DelegateToAttribute>();
        var delegatedFieldName = Fields[delegationAttribute.ServiceType];

        return $"{delegatedFieldName}.{delegationAttribute.MethodOrPropertyName}";
    }

    public RequiredString GetMethodCode(MethodInfo facadeMethod)
    {
        var delegationAttribute = facadeMethod.GetRequired<DelegateToAttribute>();
        var delegatedFieldName = Fields[delegationAttribute.ServiceType];
        var targetMethod = ResolveTargetMethod(delegationAttribute.ServiceType, delegationAttribute.MethodOrPropertyName);

        // Parameters must match to express same meaning in target as in facade
        var parameterTransform = DetermineParameterTransform(facadeMethod, targetMethod);
        RequireMatchingParameters(facadeMethod, targetMethod, delegationAttribute.ServiceType, parameterTransform);
        RequireMatchingGenericParameters(facadeMethod, targetMethod);

        var snippets = MethodCSharpGenerator.Get(facadeMethod);
        var parameters = facadeMethod.GetParameters();
        var callSignature = $"{delegatedFieldName}.{delegationAttribute.MethodOrPropertyName}{snippets.Generics}";
        var code = new StringBuilder();

        switch (parameterTransform)
        {
            case ParameterTransform.SyncExecutionMode:
                code.AppendLine($"var mode = {typeof(ExecutionMode)}.{nameof(ExecutionMode.Sync)};")
                    .AppendLine($"var task = {callSignature}(mode{PrependComma(snippets.Parameters)});")
                    .AppendLine($"{snippets.Return}{typeof(ExecutionMode)}.{nameof(ExecutionMode.ExecuteSync)}(task);");

                break;

            case ParameterTransform.AsyncExecutionMode:
                var ctParameter = parameters.Single(p => p.ParameterType == typeof(CancellationToken));
                var parametersCode = "mode" + PrependComma(MethodCSharpGenerator.GetPassParametersCode(parameters.Except(ctParameter)));
                code.AppendLine($"var mode = {typeof(ExecutionMode)}.{nameof(ExecutionMode.Async)}({ctParameter.Name});")
                    .AppendLine($"{snippets.Return}{callSignature}({parametersCode});");

                break;

            default:
                code.AppendLine($"{snippets.Return}{callSignature}({snippets.Parameters});");

                break;
        }

        return code.ToString();
    }

    private static string PrependComma(string text)
        => text.Length > 0 ? ", " + text : "";

    private static MethodInfo ResolveTargetMethod(Type serviceType, TrimmedRequiredString methodName)
    {
        var targetMethods = serviceType
            .GetFlattenedInterfaceMembers()
            .OfType<MethodInfo>()
            .Where(m => m.Name == methodName)
            .ToList();

        return targetMethods.Count == 1
            ? targetMethods[0]
            : throw new Exception(
                $"There must be a single target method according to specified [DelegateTo({serviceType}, '{methodName}')] but there are: {targetMethods.Dump()}.");
    }

    private enum ParameterTransform
    {
        None,
        SyncExecutionMode,
        AsyncExecutionMode,
    }

    private static ParameterTransform DetermineParameterTransform(MethodInfo facadeMethod, MethodInfo targetMethod)
    {
        var firstFacadeParamType = facadeMethod.GetParameters().FirstOrDefault()?.ParameterType;
        var firstTargetParamType = targetMethod.GetParameters().FirstOrDefault()?.ParameterType;

        if (firstFacadeParamType == typeof(ExecutionMode) || firstTargetParamType != typeof(ExecutionMode))
            return ParameterTransform.None;

        return !typeof(Task).IsAssignableFrom(facadeMethod.ReturnType)
            ? ParameterTransform.SyncExecutionMode
            : ParameterTransform.AsyncExecutionMode;
    }

    private static void RequireMatchingParameters(MethodInfo facadeMethod, MethodInfo targetMethod, Type targetInterface, ParameterTransform parameterTransform)
    {
        var expectedTargetParams = facadeMethod.GetParameters().ConvertAll(p => (p.ParameterType, p.Name!)).ToList();
        var executionModeParameter = (typeof(ExecutionMode), "mode");
        var isTargetMethodInherited = targetMethod.DeclaringType != targetInterface;

        switch (parameterTransform)
        {
            case ParameterTransform.SyncExecutionMode:
                expectedTargetParams.Insert(0, executionModeParameter);

                break;

            case ParameterTransform.AsyncExecutionMode:
                var ctParam = (Type: typeof(CancellationToken), Name: "cancellationToken");

                if (expectedTargetParams.Count(p => p.Equals(ctParam)) != 1)
                    throw new Exception(
                        $"There must be a single {ctParam.Type.Name} parameter with name '{ctParam.Name}' on facade method in case of async ExecutionMode transform.");

                expectedTargetParams.Insert(0, executionModeParameter);
                expectedTargetParams.Remove(ctParam);

                break;
        }

        var expectedTargetParamsSig = GetParameterSignature(expectedTargetParams);
        var targetParamsSig = GetParameterSignature(targetMethod.GetParameters().ConvertAll(p => (p.ParameterType, p.Name!)));

        if (expectedTargetParamsSig != targetParamsSig)
            throw new Exception(string.Join(
                Environment.NewLine,
                $"Parameter types{(!isTargetMethodInherited ? " and names" : "")} of facade vs. target method must match (including order) {ToDebugInfo(parameterTransform)} but they do not.",
                "Expected target parameters: " + expectedTargetParamsSig,
                "Actual target parameters: " + targetParamsSig));

        string GetParameterSignature(IReadOnlyList<(Type Type, string Name)> parameters)
            => parameters.ConvertAll(p => p.Type + (!isTargetMethodInherited ? " " + p.Name : "")).Join(); // Inherited method can declare different names
    }

    private static void RequireMatchingGenericParameters(MethodInfo facadeMethod, MethodInfo targetMethod)
    {
        var facadeSignature = GetGenericParametersSignature(facadeMethod);
        var targetSignature = GetGenericParametersSignature(targetMethod);

        if (facadeSignature != targetSignature)
            throw new Exception(string.Join(
                Environment.NewLine,
                "Generic parameters with their constraints of facade and target method must match in particular order.",
                "Facade generic parameters: " + facadeSignature,
                "Target generic parameters: " + targetSignature));

        string GetGenericParametersSignature(MethodInfo method)
            => method.IsGenericMethodDefinition
                ? method.GetGenericArguments().Select(a => a.Name).Join()
                : "(not generic)";
    }

    private static string ToDebugInfo(ParameterTransform transform)
        => transform != ParameterTransform.None ? $"according to parameter transform {transform}" : "directly";
}
