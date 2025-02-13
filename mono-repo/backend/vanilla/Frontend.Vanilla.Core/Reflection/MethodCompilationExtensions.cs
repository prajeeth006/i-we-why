using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection;

/// <summary>Universal method which was created by compiling a <see cref="MethodInfo" />.</summary>
internal delegate object CompiledMethod(object thisObj, params object[] arguments);

/// <summary>
/// Helper for compiling a method obtained via reflection to a delegate using compiled expressions because their perfomance is close to compiled code.
/// See http://www.palmmedia.de/Blog/2012/2/4/reflection-vs-compiled-expressions-vs-delegates-performance-comparision.
/// </summary>
internal static class MethodCompilationExtensions
{
    /// <summary>Compiles to universal delegate. Supports static methods too.</summary>
    public static CompiledMethod Compile(this MethodInfo method)
    {
        Guard.NotNull(method.DeclaringType, nameof(method), $"{nameof(method.DeclaringType)} must not be null");

        // Input
        var thisExpr = Expression.Parameter(typeof(object), "obj");
        var argsExpr = Expression.Parameter(typeof(object[]), "args");

        // Convert input to respective types
        var typedThisExpr = Expression.Convert(thisExpr, method.DeclaringType!);
        var paramTypes = method.GetParameters().Select(p => p.ParameterType);
        var typedArgsExprs = paramTypes.Select((t, i) => Expression.Convert(Expression.ArrayIndex(argsExpr, Expression.Constant(i)), t));

        // Actual call
        var methodCallExpr = Expression.Call(!method.IsStatic ? typedThisExpr : null, method, typedArgsExprs);

        // Convert result or return null for void methods
        var bodyExpr = method.ReturnType != typeof(void)
            ? (Expression)Expression.Convert(methodCallExpr, typeof(object))
            : Expression.Block(methodCallExpr, Expression.Constant(null));

        return Expression.Lambda<CompiledMethod>(bodyExpr, thisExpr, argsExpr).Compile();
    }

    /// <summary>Compiles to specified delegate.</summary>
    public static TDelegate Compile<TDelegate>(this MethodInfo method)
    {
        var delegateMethod = typeof(TDelegate).GetRequired<MethodInfo>(nameof(Func<object>.Invoke));
        var thisType = delegateMethod.GetParameters().Select(p => p.ParameterType).FirstOrDefault()
                       ?? throw new Exception($"Delegate {typeof(TDelegate)} must use first parameter for passing 'this' instance.");
        var resultType = delegateMethod.ReturnType;

        // Input
        var thisExpr = Expression.Parameter(thisType, "obj");
        var argExprs = method.GetParameters().Select((p, i) => Expression.Parameter(p.ParameterType, $"arg{i}"));

        // Actual call
        var methodCallExpr = Expression.Call(thisExpr, method, argExprs);

        // Convert result or return null for void methods
        Expression bodyExpr;
        if (resultType == typeof(void))
            bodyExpr = Expression.Block(methodCallExpr, Expression.Constant(null));
        else if (resultType != method.ReturnType)
            bodyExpr = Expression.Convert(methodCallExpr, resultType);
        else
            bodyExpr = methodCallExpr;

        return Expression.Lambda<TDelegate>(bodyExpr, argExprs.Prepend(thisExpr)).Compile();
    }
}
