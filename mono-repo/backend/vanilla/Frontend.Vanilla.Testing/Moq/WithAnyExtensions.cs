#nullable enable

using System;
using System.Linq.Expressions;
using System.Reflection;
using Moq;
using Moq.Language.Flow;

namespace Frontend.Vanilla.Testing.Moq;

/// <summary>Extension methods to setup or verify a call regardless of arguments.</summary>
public static class WithAnyExtensions
{
    private static readonly ExpressionVisitor Visitor = new MakeAnyArgVisitor();

    /// <summary>Performs setup on the mock regardless of arguments.</summary>
    public static ISetup<T, TResult> SetupWithAnyArgs<T, TResult>(this Mock<T> mock, Expression<Func<T, TResult>> expression)
        where T : class
        => mock.Setup(Visitor.VisitAndConvert(expression, "SetupIgnoreArgs"));

    /// <summary>Performs setup on the mock regardless of arguments.</summary>
    public static ISetup<T> SetupWithAnyArgs<T>(this Mock<T> mock, Expression<Action<T>> expression)
        where T : class
        => mock.Setup(Visitor.VisitAndConvert(expression, "SetupIgnoreArgs"));

    /// <summary>Performs verification on the mock regardless of arguments.</summary>
    public static void VerifyWithAnyArgs<T>(this Mock<T> mock, Expression<Action<T>> expression, Func<Times> times)
        where T : class
        => mock.VerifyWithAnyArgs(expression, times.Invoke());

    /// <summary>Performs verification on the mock regardless of arguments.</summary>
    public static void VerifyWithAnyArgs<T>(this Mock<T> mock, Expression<Action<T>> expression, Times? times = null)
        where T : class
        => mock.Verify(Visitor.VisitAndConvert(expression, "VerifyIgnoreArgs"), times ?? Times.AtLeastOnce());

    /// <summary>Performs verification on the mock regardless of arguments.</summary>
    public static void VerifyWithAnyArgs<T, TResult>(this Mock<T> mock, Expression<Func<T, TResult>> expression, Func<Times> times)
        where T : class
        => mock.VerifyWithAnyArgs(expression, times.Invoke());

    /// <summary>Performs verification on the mock regardless of arguments.</summary>
    public static void VerifyWithAnyArgs<T, TResult>(this Mock<T> mock, Expression<Func<T, TResult>> expression, Times? times = null)
        where T : class
        => mock.Verify(Visitor.VisitAndConvert(expression, "VerifyIgnoreArgs"), times ?? Times.AtLeastOnce());

    private class MakeAnyArgVisitor : ExpressionVisitor
    {
        private static readonly MethodInfo IsAnyMethod = typeof(It).GetMethod("IsAny") ?? throw new Exception("Missing It.IsAny().");

        protected override Expression VisitConstant(ConstantExpression node)
            => Expression.Call(IsAnyMethod.MakeGenericMethod(node.Type));
    }
}
