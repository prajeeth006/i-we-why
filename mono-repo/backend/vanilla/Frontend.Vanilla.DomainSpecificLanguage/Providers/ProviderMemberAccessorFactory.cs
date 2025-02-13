using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>Builds <see cref="ProviderMemberAccessor" />.</summary>
internal interface IProviderMemberAccessorFactory
{
    ProviderMemberAccessor Create(MethodInfo method, object providerInstance);
}

/// <summary>Builds the accessor by compiling C# expressions to gain the best possible performance.</summary>
internal sealed class ProviderMemberAccessorFactory : IProviderMemberAccessorFactory
{
    public ProviderMemberAccessor Create(MethodInfo method, object providerInstance)
    {
        // Input
        var executionModeExpression = Expression.Parameter(typeof(ExecutionMode), "mode");
        var argsExpression = Expression.Parameter(typeof(object[]), "args");

        // Convert input to respective types
        var providerExpression = Expression.Constant(providerInstance, method.DeclaringType!);
        var parameters = method.GetParameters();
        var hasExecutionMode = parameters.FirstOrDefault()?.ParameterType == typeof(ExecutionMode);
        var typedArgExpressions = parameters
            .Select(p => p.ParameterType)
            .Skip(hasExecutionMode ? 1 : 0)
            .Select((t, i) => (Expression)Expression.Convert(Expression.ArrayIndex(argsExpression, Expression.Constant(i)), t))
            .Prepend(hasExecutionMode ? new[] { executionModeExpression } : Array.Empty<ParameterExpression>());

        // Actual call
        var providerCallExpression = Expression.Call(providerExpression, method, typedArgExpressions);

        var bodyExpression = BuildExtractResultExpression(providerCallExpression, method);

        return Expression.Lambda<ProviderMemberAccessor>(bodyExpression, executionModeExpression, argsExpression).Compile();
    }

    /// <summary>Converts result or the task or return null for void methods.</summary>
    private static Expression BuildExtractResultExpression(Expression providerCallExpression, MethodInfo method)
    {
        if (method.ReturnType == typeof(void))
        {
            return Expression.Block(providerCallExpression, Expression.Constant(VoidDslResult.SingletonTask));
        }

        if (method.ReturnType == typeof(Task))
        {
            return Expression.Call(AwaitAndReturnDummyResultMethod, providerCallExpression);
        }

        if (method.ReturnType.IsGenericType && method.ReturnType.GetGenericTypeDefinition() == typeof(Task<>))
        {
            var resultType = method.ReturnType.GetGenericArguments().Single();
            var toTaskOfObjectMethod = ToTaskOfObjectNonGenericMethod.MakeGenericMethod(resultType);

            return Expression.Call(toTaskOfObjectMethod, providerCallExpression);
        }

        return Expression.Call(TaskFromResultMethod, Expression.Convert(providerCallExpression, typeof(object)));
    }

    private static readonly MethodInfo TaskFromResultMethod = typeof(Task).GetRequired<MethodInfo>(nameof(Task.FromResult)).MakeGenericMethod(typeof(object));
    private static readonly MethodInfo AwaitAndReturnDummyResultMethod = typeof(ProviderMemberAccessorFactory).GetRequired<MethodInfo>(nameof(AwaitAndReturnDummyResult));
    private static readonly MethodInfo ToTaskOfObjectNonGenericMethod = typeof(ProviderMemberAccessorFactory).GetRequired<MethodInfo>(nameof(ToTaskOfObject));

    public static async Task<object> AwaitAndReturnDummyResult(Task task)
    {
        await task;

        return VoidDslResult.Singleton;
    }

    public static async Task<object> ToTaskOfObject<T>(Task<T> task)
        where T : notnull
        => await task;
}
